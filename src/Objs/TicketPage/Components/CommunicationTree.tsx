import React from "react";
import classNames from "classnames";

import Loader from "../../../Components/Loader";
import noUserImg from "../../../assets/images/icons/profile_img.svg";
import Message from "./Message";
import i18n from "../../../config/i18n";

const CommunicationTree = ({
  messages,
  status,
}) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const messagesEndRef = React.useRef(null as any);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

  React.useEffect(() => {
    if (status === "uploading") {
      scrollToBottom();
    }
  }, [status]);

  return (
    <div className="text_content box_bg_white box">
      <div className="com_tree max_width_element">
        {messages.length > 1 && (
          <div className={classNames("previous-messages-container", { collapsed: collapsed })}>
            <div className="button-wrapper">
              <button className="btn btn-link" type="button" onClick={() => setCollapsed(false)}>
                {i18n.t("TicketListWidget.show_previous_messages")}
              </button>
              <hr />
            </div>

            <div className="left_com">
              <div className="com_content">
                {messages.slice(0, -1).map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isLast={false}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="left_com">
          <div className="com_content">
            {messages.slice(-1).map((message) => (
              <Message
                key={message.id}
                message={message}
                isLast={messages.length > 1}
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
