import React from "react";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import { DEFAULT_TIME_FORMAT } from "../../../utils/constants";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import { parseDate } from "../../../utils/dateUtils";
import noUserImg from "../../../assets/images/icons/profile_img.svg";
import { Keyable } from "../../../utils/types";
import MessageAttachment from "./MessageAttachment";

function Message({ message }) {
  return (
    <>
      <span className="person_list_img">
        <span className="wrapper_img_profil">
          <img
            src={message.user.avatar_url || noUserImg}
            alt={`${[message.user.first_name, message.user.last_name].join(" ")}'s avatar`}
            className="img_cover"
          />
        </span>
      </span>

      <div className="name_time_stamp_wrapper">
        <h5>
          {[message.user.first_name, message.user.last_name].filter(e => !!e).join(" ")}
        </h5>
        <span className="time_stamp">
          {parseDate(message.created_at, DEFAULT_TIME_FORMAT)}
        </span>
      </div>

      <p>
        {parse(
          sanitizeHtml(newlinesToBreaks(message.text), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              "img",
            ]),
          })
        )}
      </p>

      <div className="img-attachment-area">
        <div className="row">
          {message.attachments?.map((attachment: Keyable, index: number) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" key={`${index}-${attachment.filename}`}>
              <MessageAttachment
                key={attachment.filename}
                attachment={attachment}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Message;
