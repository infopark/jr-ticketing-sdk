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
import ticketingUrl from "../../../api/ticketingUrl";

type Attachment = {
  filename: string;
  extension: string;
  s3_url: string;
};

function Message({
  message,
  sender,
  isUsersMessage,
}) {
  const images: Attachment[] = [];
  const files: Attachment[] = [];

  message.attachments && message.attachments.forEach((file) => {
    const attachment: Attachment = {
      ...file,
      extension: file.filename.split(".").pop(),
    };
    if (isImageFormat(attachment.extension)) {
      images.push(attachment);
    } else {
      files.push(attachment);
    }
  });

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
          <div>
            {parse(
              sanitizeHtml(newlinesToBreaks(message.text), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                  "img",
                ]),
              })
            )}
          </div>
          {files.map((attachment) => (
            <MessageFile
              key={attachment.filename}
              attachment={attachment}
            />
          ))}
          {images.map((attachment) => (
            <MessageImage
              key={attachment.filename}
              attachment={attachment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// TODO merge MessageImage and Message File into MessageAttachment

function MessageImage({ attachment }) {
  return (
    <div className="collapsebox">
      <a
        href={`${ticketingUrl()}/attachments/${attachment.key}`}
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

function MessageFile({ attachment }) {
  const fileIcon = matchExtension(attachment.extension);

  return (
    <div className="collapsebox">
      <img src={fileIcon} alt="" className="nav_img" />
      <small className="color_text">{attachment.filename}</small>
      <a
        href={`${ticketingUrl()}/attachments/${attachment.key}`}
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
