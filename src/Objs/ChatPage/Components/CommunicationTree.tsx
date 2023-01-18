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
  messages,
  status,
  mode,
}) => {
  const { userData } = useTenantContext();
  const messagesEndRef = useRef(null as any);
  const scrollToBottom = () => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  };

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
          messages={messages}
          loggedUserData={userData || {}}
        />
        <Placeholder show={status === "uploading"} />
        <div ref={messagesEndRef} />
      </InnerPageContentWrapper>
    </PageContentWrapper>
  );
};

export default CommunicationTree;

const CommunicationDayTree = ({
  messages,
  loggedUserData,
}) => {
  const days = groupBy(messages, (message) =>
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

      for (const message of messages) {
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
  }, [loggedUserData, messages]);

  return (
    <div className="com_tree max_width_element">
      {Object.entries(days).map(([day, dailyMessages]) => (
        <DailyMessages
          key={day}
          day={day}
          messages={dailyMessages}
          senders={senders}
          loggedUser={loggedUserId}
        />
      ))}
    </div>
  );
};

const DailyMessages = ({
  day,
  messages,
  senders,
  loggedUser,
}) => {
  return (
    <>
      <div className="com_date text_center light">
        <span className="date_bg">{day}</span>
        <span className="time_line"></span>
      </div>
      {messages.map((message) => {
        const isUsersMessage = loggedUser === message.userid;
        return (
          <Message
            key={message.id}
            message={message}
            sender={senders[message.userid] || senders.unknown}
            isUsersMessage={isUsersMessage}
          />
        );
      })}
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
