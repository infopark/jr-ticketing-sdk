import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { groupBy } from "lodash-es";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import { parseDate } from "../../../utils/dateUtils";
import { callApiGet, callApiPost } from "../../../api/portalApiCalls";
import { isImageFormat } from "../../../utils/isImage";
import Loader from "../../../Components/Loader";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from "../../../utils/constants";
import noUserImg from "../../../assets/images/icons/profile_img.svg";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import i18n from "../../../config/i18n";
import { matchExtension } from "../../../utils/fileExtension";
import PageContentWrapper from "./PageContentWrapper";
import InnerPageContentWrapper from "./InnerPageContentWrapper";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";

const unknownUser = {
  first_name: "",
  last_name: "",
  avatar_url: noUserImg,
};

const CommunicationTree = ({
  comm,
  status,
  mode,
  refreshCallback,
  isClosed,
}) => {
  const { userData } = useTenantContext();
  const messagesEndRef = useRef(null as any);
  const scrollToBottom = () => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  };

  const isAttachmentsMode = mode === "attachments";
  const communications = isAttachmentsMode
    ? comm.filter((message) => message.attachments)
    : comm;

  useEffect(() => {
    scrollToBottom();
  }, [mode]);

  useEffect(() => {
    if (status === "uploading") {
      scrollToBottom();
    }
  }, [status]);

  return (
    <PageContentWrapper>
      <InnerPageContentWrapper additionalBoxClass="min_hight_box">
        <CommunicationDayTree
          communications={communications}
          loggedUserData={userData || {}}
          isAttachmentsMode={isAttachmentsMode}
          refreshCallback={refreshCallback}
          isClosed={isClosed}
        />
        <Placeholder show={status === "uploading"} />
        <div ref={messagesEndRef} />
      </InnerPageContentWrapper>
    </PageContentWrapper>
  );
};

export default CommunicationTree;

const CommunicationDayTree = ({
  communications,
  loggedUserData,
  isAttachmentsMode,
  refreshCallback,
  isClosed,
}) => {
  const { userData } = useTenantContext();
  const days = groupBy(communications, (message) =>
    parseDate(
      message.created_at,
      DEFAULT_DATE_FORMAT,
      userData && userData.timelocale
    )
  );
  const loggedUserId = loggedUserData.id;

  const [senders, setSenders] = useState({
    unknown: unknownUser,
    [loggedUserData.id]: loggedUserData,
  });

  useEffect(() => {
    const getMessageSenders = async () => {
      const requestedUsers = { [loggedUserData.id]: true };
      const pendingRequests = [] as any[];

      for (const message of communications) {
        const { user_id } = message;
        if (!requestedUsers[user_id]) {
          requestedUsers[user_id] = true;
          pendingRequests.push(
            callApiGet(`users/${user_id}`).then((response) => {
              if (response.failedRequest) {
                return undefined;
              }
              return response[0];
            })
          );
        }
      }

      const users = await Promise.all(pendingRequests);
      const mappedUsers = users.reduce((usersById, user) => {
        if (user) {
          usersById[user.id] = user;
        }
        return usersById;
      }, {});

      mappedUsers.unknown = unknownUser;
      mappedUsers[loggedUserData.id] = loggedUserData;
      setSenders(mappedUsers);
    };
    getMessageSenders();
  }, [loggedUserData, communications]);

  return (
    <div className="com_tree max_width_element">
      {Object.entries(days).map(([day, dailyMessages]) => (
        <React.Fragment key={day}>
          <GroupDate day={day} />
          <DailyMessages
            messages={dailyMessages}
            senders={senders}
            loggedUser={loggedUserId}
            isAttachmentsMode={isAttachmentsMode}
            refreshCallback={refreshCallback}
            isClosed={isClosed}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

const GroupDate = ({ day }) => (
  <div className="com_date text_center light">
    <span className="date_bg">{day}</span>
    <span className="time_line"></span>
  </div>
);

const DailyMessages = ({
  messages,
  senders,
  loggedUser,
  isAttachmentsMode,
  refreshCallback,
  isClosed,
}) =>
  messages.map((message) => {
    const isUsersMessage = loggedUser === message.userid;
    return (
      <Message
        key={message.id}
        message={message}
        sender={senders[message.userid] || senders.unknown}
        isUsersMessage={isUsersMessage}
        isAttachmentsMode={isAttachmentsMode}
        refreshCallback={refreshCallback}
        isClosed={isClosed}
      />
    );
  });

const Message = ({
  message,
  sender,
  isUsersMessage,
  isAttachmentsMode,
  refreshCallback,
  isClosed,
}) => {
  const { userData } = useTenantContext();

  return (
    <div
      className={classNames({
        left_com: isUsersMessage,
        right_com: !isUsersMessage,
      })}
    >
      <span className="person_list_img">
        <span className="wrapper_img_profil">
          {
            <img
              src={sender.avatar_url || noUserImg}
              alt="User avatar"
              className="img_cover"
            />
          }
        </span>
      </span>

      <div className="com_content">
        <div className="box_bg_white box">
          <h4>
            {sender.first_name} {sender.last_name}
          </h4>
          <span className="time_stamp">
            {parseDate(
              message.created_at,
              DEFAULT_TIME_FORMAT,
              userData && userData.timelocale
            )}
          </span>
          {!isAttachmentsMode && (
            <div>
              {parse(
                sanitizeHtml(newlinesToBreaks(message.text), {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    "img",
                  ]),
                })
              )}
            </div>
          )}
          {message.attachments && (
            <Attachment
              message={message}
              refreshCallback={refreshCallback}
              isClosed={isClosed}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// TODO remove handleDeleteAttachment and button
const Attachment = ({ message, refreshCallback, isClosed }) => {
  const handleDeleteAttachment = async (msg) => {
    const cdnData = {
      path: msg.attachment,
    };
    const cdnResponse = await callApiPost("delete-cdn-object", cdnData);
    if (
      cdnResponse.failedRequest ||
      cdnResponse.status !== "fileDeleteSuccess"
    ) {
      return;
    }
    if (message.text) {
      const tmData = {
        attachment: "",
      };
      await callApiPost(`update-ticketmessage/${msg.ticketmessageid}`, tmData);
    } else {
      await callApiPost(`delete-ticketmessage/${msg.ticketmessageid}`, {});
    }
    refreshCallback();
  };

  if (message.attachments.length === 0) {
    return null;
  }

  console.log(message.attachments);
  const attachment = message.attachments[0];

  const fileName = attachment.filename;
  const fileExt = fileName.split(".").pop();
  const isImage = isImageFormat(fileExt);
  const fileIcon = matchExtension(fileExt);

  return (
    <>
      <div className="collapsebox">
        {isImage && (
          <>
            <button
              className="btn btn-secondary float_right attachment-delete image"
              onClick={() => handleDeleteAttachment(message)}
              type="button"
              disabled={isClosed}
            >
              {i18n.t("delete")}
            </button>
            <a
              href={attachment.s3_url}
              target="_blank"
              className="btn btn-secondary float_right image"
              download
              rel="noreferrer"
            >
              {i18n.t("download")}
            </a>
            <img
              src={attachment.s3_url}
              className="attachment_img"
              alt="img"
            />
          </>
        )}
        {!isImage && fileName && (
          <>
            <img src={fileIcon} alt="" className="nav_img" />
            <small className="color_text">{fileName}</small>
            <button
              className="btn btn-secondary float_right attachment-delete"
              onClick={(event) => {
                event.preventDefault();
                handleDeleteAttachment(message);
              }}
              type="button"
            >
              {i18n.t("delete")}
            </button>
            <a
              href={attachment.s3_url}
              target="_blank"
              className="btn btn-secondary float_right image"
              download
              rel="noreferrer"
            >
              {i18n.t("download")}
            </a>
          </>
        )}
      </div>
    </>
  );
};

const Placeholder = ({ show }) => {
  if (!show) {
    return null;
  }
  const avatarSrc = noUserImg;
  return (
    <div className="left_com upload_loader">
      <span className="person_list_img">
        <img src={avatarSrc} alt="User avatar" className="img_cover" />
      </span>
      <div className="com_content">
        <div className="sdk box_bg_white box">
          <Loader comp="chat" />
        </div>
      </div>
    </div>
  );
};
