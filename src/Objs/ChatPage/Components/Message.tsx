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

type Attachment = {
  filename: string;
  extension: string;
  s3_url: string;
}

function Message({
  message,
  sender,
  isUsersMessage,
  isAttachmentsMode,
  refreshCallback,
  isClosed,
}) {
  const images: Attachment[] = [];
  const files: Attachment[] = [];

  message.attachments && message.attachments.forEach((file) => {
    const attachment: Attachment = {
      filename: file.filename,
      extension: file.filename.split(".").pop(),
      s3_url: file.s3_url,
    }
    if (isImageFormat(attachment.extension)) {
      images.push(attachment);
    } else {
      files.push(attachment);
    }
  })

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
          {files.map((attachment) => (
            <MessageFile
              key={attachment.filename}
              message={message}
              attachment={attachment}
              onDelete={() => {}}
              isClosed={isClosed}
            />
          ))}
          {images.map((attachment) => (
            <MessageImage
              key={attachment.filename}
              message={message}
              attachment={attachment}
              onDelete={() => {}}
              isClosed={isClosed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// TODO onDelete

// TODO merge MessageImage and Message File into MessageAttachment

function MessageImage({ message, attachment, onDelete, isClosed }) {
  return (
    <div className="collapsebox">
      <button
        className="btn btn-secondary float_right attachment-delete image"
        onClick={() => onDelete(message)}
        type="button"
        disabled={isClosed}
      >
        {i18n.t("Message.delete_attachment")}
      </button>
      <a
        href={attachment.s3_url}
        target="_blank"
        className="btn btn-secondary float_right image"
        download
        rel="noreferrer"
      >
        {i18n.t("Message.download_attachment")}
      </a>
      <img
        src={attachment.s3_url}
        className="attachment_img"
        alt="img"
      />
    </div>
  );
}

function MessageFile({ message, attachment, onDelete, isClosed }) {
  const fileIcon = matchExtension(attachment.extension);

  return (
    <div className="collapsebox">
      <img src={fileIcon} alt="" className="nav_img" />
      <small className="color_text">{attachment.filename}</small>
      <button
        className="btn btn-secondary float_right attachment-delete"
        onClick={() => onDelete(message)}
        type="button"
      >
        {i18n.t("Message.delete_attachment")}
      </button>
      <a
        href={attachment.s3_url}
        target="_blank"
        className="btn btn-secondary float_right image"
        download
        rel="noreferrer"
      >
        {i18n.t("Message.download_attachment")}
      </a>
    </div>
  );
}

export default Message;
