import React, { useEffect, useRef } from "react";

import Loader from "../../../Components/Loader";
import noUserImg from "../../../assets/images/icons/profile_img.svg";
import Message from "./Message";

const CommunicationTree = ({
  messages,
  status,
}) => {
  const messagesEndRef = useRef(null as any);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

  useEffect(() => {
    if (status === "uploading") {
      scrollToBottom();
    }
  }, [status]);

  return (
    <div className="text_content box_bg_white box">
      <div className="com_tree max_width_element">
        <div className="left_com">
          <div className="com_content">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
              />
            ))}

            {status === "uploading" && <Placeholder />}
          </div>
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default CommunicationTree;

const Placeholder = () => {
  const avatarSrc = noUserImg;

  return (
    <>
      <span className="person_list_img">
        <span className="wrapper_img_profil">
          <img
            src={avatarSrc}
            alt="User avatar"
            className="img_cover"
          />
        </span>
      </span>

      <div className="name_time_stamp_wrapper">
        <h5>
          &nbsp;
        </h5>
        <span className="time_stamp">
          &nbsp;
        </span>
      </div>

      <p>
        <div className="sdk box_bg_white box">
          <Loader comp="chat" />
        </div>
      </p>
    </>
  );
};
