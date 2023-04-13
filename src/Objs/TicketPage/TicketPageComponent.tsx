/* eslint-disable no-console */
import React from "react";
import * as Scrivito from "scrivito";

import TicketingApi from "../../api/TicketingApi";
import Loader from "../../Components/Loader";
import { isInVisitedPages, addToVisitedPages } from "../../utils/visitedPages";
import CommunicationTree from "./Components/CommunicationTree";
import MessageArea from "./Components/MessageArea";
import TicketDetails from "./Components/TicketDetails";
import TicketHeader from "./Components/TicketHeader";
import { Keyable } from "../../utils/types";
import useWS from "../../utils/useWS";
import useAsyncError from "../../utils/useAsyncError";
import { useTicketingContext } from "../../Components/TicketingContextProvider";

Scrivito.provideComponent("TicketPage", ({ page }) => {
  const [ticket, setTicket] = React.useState<Keyable>();
  const [status, setStatus] = React.useState<string>("idle");
  const msg = useWS("tickets", ticket?.id);
  const throwError = useAsyncError();
  const { addError } = useTicketingContext();

  const ticketUiSchema = JSON.parse(page?.get("uiSchema") as string || "{}");

  const getTicket = async (effectStatus) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ticketid = urlParams.get("ticketid");
      const ticket = ticketid && (await TicketingApi.get(`tickets/${ticketid}?include=messages,messages.user`));
      if (effectStatus.canceled) {
        return;
      }

      if (!ticket) {
        throwError(new Error("NOT_FOUND"));
      }

      setStatus("idle");
      setTicket(ticket);

      if (wasTicketCreatedLessThanMsAgo(ticket, 1000)) {
        // ask again about the ticket details, it was created just now
        setTimeout(async () => {
          const result = await TicketingApi.get(`tickets/${ticketid}`);
          if (!effectStatus.canceled) {
            setTicket(result);
          }
        }, 3500);
      }
    } catch (error) {
      addError("Error loading ticket", "TicketPage", error);
    }
  };

  const getTicketCallback = React.useCallback((effectStatus) => {
    const refreshTicket = getTicket;
    refreshTicket(effectStatus);
  }, []);

  React.useEffect(() => {
    const effectStatus = { canceled: false };
    getTicketCallback(effectStatus);
    return () => {
      effectStatus.canceled = true;
    };
  }, [msg, getTicketCallback, history]);

  const refreshCallback = async () => {
    setStatus("uploading");
    getTicketCallback({ canceled: false });
    setStatus("idle");
  };

  React.useEffect(() => {
    saveScrollPosition();
    window.addEventListener("scroll", saveScrollPosition);
    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      window.sessionStorage.removeItem("scroll-position");
    };
  }, []);

  if (!ticket) {
    return (
      <div className="jr-ticketing-sdk white-bg-loader">
        <Loader />
      </div>
    );
  }

  Scrivito.load(() => {
    if (page && !isInVisitedPages(page)) {
      addToVisitedPages(page);
    }
  });

  const isTicketClosed = ticket.status === "closed";

  return (
    <div className="col-lg-12 jr-ticketing-sdk sdk-ticket-details">
      <TicketHeader ticket={ticket} page={page as Scrivito.Obj} />

      <div className="content_padding">
        <div className="page_content">
          <div className="wrapper_box min_hight_box">
            <div className="row">
              <div className="col-lg-4 order-lg-2">
                <TicketDetails ticket={ticket} ticketUiSchema={ticketUiSchema} />
              </div>
              <div className="col-lg-8 order-lg-1">
                <CommunicationTree
                  messages={ticket.messages}
                  status={status}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MessageArea
        ticketId={ticket.id}
        refreshCallback={refreshCallback}
        isClosed={isTicketClosed}
      />
    </div>
  );
});

function wasTicketCreatedLessThanMsAgo(ticket, diffMs) {
  const d = new Date(ticket && ticket.creationdate);
  return Date.now() - d.getTime() < diffMs;
}

function saveScrollPosition() {
  const { pageYOffset } = window;
  window.sessionStorage.setItem("scroll-position", `${pageYOffset}`);
}
