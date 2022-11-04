/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from "react";
import * as Scrivito from "scrivito";
import academyIcon from "../../assets/images/icons/academy.svg";
import documentationIcon from "../../assets/images/icons/documentation.svg";
import helpdeskIcon from "../../assets/images/icons/helpdesk_black.svg";
import { translate } from "../../utils/translate";
import { callApiGet } from "../../api/portalApiCalls";

const HistoryListEntry = ({ link, title, pageType, query }) => {
  const [ticketName, setTicketName] = useState(null);

  const setTicketData = useCallback((ticketUpdate) => {
    async function setTicketFromId({ ticketId, canceled }) {
      try {
        const ticketResponse = await callApiGet(`tickets/${ticketId}`);
        if (canceled) {
          return;
        }
        if (!ticketResponse.failedRequest) {
          setTicketName(ticketResponse[0].title);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setTicketFromId(ticketUpdate);
  }, []);

  useEffect(() => {
    const ticketUpdate = {
      canceled: false,
    } as any;

    if (!title && pageType === "ChatPage") {
      const search = new URLSearchParams(query);
      const params = {} as any;
      search.forEach((value, key) => {
        params[key] = value;
      });
      ticketUpdate.ticketId = params.ticketid;
      setTicketData(ticketUpdate);
    }

    // cleanup
    return () => {
      ticketUpdate.canceled = true;
    };
  }, [title, pageType, query, setTicketData]);

  if (!link) {
    return null;
  }
  const typeMapping = {
    TrainingPage: {
      icon: academyIcon,
      name: translate("Academy Page" as any),
    },
    TrainingHomePage: {
      icon: academyIcon,
      name: translate("Academy Page" as any),
    },
    ChatPage: {
      icon: helpdeskIcon,
      name: translate("Helpdesk Ticket" as any),
    },
    DocumentationPage: {
      icon: documentationIcon,
      name: translate("Documentation"),
    },
    DocumentationHomePage: {
      icon: documentationIcon,
      name: translate("Documentation"),
    },
    Page: {
      icon: academyIcon,
      name: "Page",
    },
    Homepage: {
      icon: documentationIcon,
      name: "Homepage",
    },
    default: {
      icon: documentationIcon,
      name: "unknown page type",
    },
  };
  const pageTypeIcon =
    pageType && typeMapping[pageType]
      ? typeMapping[pageType].icon
      : typeMapping.default.icon;
  const pageTypeName =
    pageType && typeMapping[pageType]
      ? typeMapping[pageType].name
      : typeMapping.default.name;
  return (
    <li>
      <Scrivito.LinkTag to={link}>
        <img src={pageTypeIcon} alt="chapter icon" className="nav_img" />
        <i className="fa fa-angle-right" aria-hidden="true"></i>
        <span className="dots">{title || ticketName}</span>
        <small className="block dots">{pageTypeName}</small>
      </Scrivito.LinkTag>
    </li>
  );
};

export default HistoryListEntry as any;
