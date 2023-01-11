import React from "react";
import classNames from "classnames";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import i18n from "../../../config/i18n";
import { DEFAULT_TIME_FORMAT } from "../../../utils/constants";
import { isImageFormat } from "../../../utils/isImage";
import { matchExtension } from "../../../utils/fileExtension";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import { parseDate } from "../../../utils/dateUtils";
import noUserImg from "../../../assets/images/icons/profile_img.svg";
import { callApiPost } from "../../../api/portalApiCalls";

function Message({
  message,
  sender,
  isUsersMessage,
  isAttachmentsMode,
  refreshCallback,
  isClosed,
}) {
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
            {parseDate(message.created_at, DEFAULT_TIME_FORMAT)}
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

export default Message;
