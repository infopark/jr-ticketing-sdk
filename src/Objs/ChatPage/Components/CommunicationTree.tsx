import React, { useEffect, useRef, useState } from "react";
import { groupBy } from "lodash-es";

import { parseDate } from "../../../utils/dateUtils";
import { callApiGet } from "../../../api/portalApiCalls";
import Loader from "../../../Components/Loader";
import { DEFAULT_DATE_FORMAT } from "../../../utils/constants";
import noUserImg from "../../../assets/images/icons/profile_img.svg";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import Message from "./Message";
import PageContentWrapper from "./PageContentWrapper";
import InnerPageContentWrapper from "./InnerPageContentWrapper";

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
  const days = groupBy(communications, (message) =>
    parseDate(message.created_at, DEFAULT_DATE_FORMAT)
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
