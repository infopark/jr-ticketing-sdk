/* eslint-disable no-console */
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import * as Scrivito from "scrivito";

import TicketingApi from "../../api/TicketingApi";
import Loader from "../../Components/Loader";
import { isInVisitedPages, addToVisitedPages } from "../../utils/visitedPages";
import CommunicationTree from "./Components/CommunicationTree";
import MessageArea from "./Components/MessageArea";
import TicketDetails from "./Components/TicketDetails";
import TicketHeader from "./Components/TicketHeader";
import i18n from "../../config/i18n";
import { Keyable } from "../../utils/types";
import useWS from "../../utils/useWS";

const TICKET_NOT_FOUND = { status: "ticket-not-found" };

Scrivito.provideComponent("TicketPage", ({ page }) => {
  const [ticket, setTicket] = useState<Keyable>();
  const [status, setStatus] = useState<string>("idle");
  const msg = useWS("tickets", ticket?.id);

  const getTicket = async (effectStatus) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ticketid = urlParams.get("ticketid");
      const ticket =
        ticketid && (
          await TicketingApi.get(`tickets/${ticketid}?include=messages,messages.user`)
            .then((data) => {
              if (data.failedRequest || effectStatus.canceled) {
                return TICKET_NOT_FOUND;
              }
              return data;
            })
            .finally(() => setStatus("idle")));

      if (effectStatus.canceled) {
        return;
      }
      setTicket(ticket);

      if (wasTicketCreatedLessThanMsAgo(ticket, 1000)) {
        // ask again about the ticket details, it was created just now
        setTimeout(() => {
          TicketingApi.get(`tickets/${ticketid}`)
            .then((data) => {
              if (data.failedRequest) {
                return;
              }
              return data[0];
            })
            .then((result) => {
              if (result && !effectStatus.canceled) {
                setTicket(result);
              }
            });
        }, 3500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTicketCallback = useCallback((effectStatus) => {
    const refreshTicket = getTicket;
    refreshTicket(effectStatus);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    saveScrollPosition();
    window.addEventListener("scroll", saveScrollPosition);
    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      window.sessionStorage.removeItem("scroll-position");
    };
  }, []);

  if (ticket === TICKET_NOT_FOUND) {
    return (
      <div className="col-lg-12 jr-ticketing-sdk sdk-ticket-details">
        <div className="container">
          <div className="text-center pt-5">
            <h1 className="hero-bold">{i18n.t("Ticket not found!")}</h1>
          </div>
          <div className="text-center">
            <h2 className="hero-small light">
              {i18n.t(
                "Ticket you are looking for was either deleted or its address is wrong."
              )}
            </h2>
          </div>
          <div className="text-center">
            <Scrivito.LinkTag
              to={Scrivito.Obj.root()}
              className="btn btn-primary"
            >
              {i18n.t("Go to mainpage")}
              <i className="fa fa-angle-right ml-1" aria-hidden="true" />
            </Scrivito.LinkTag>
          </div>
        </div>
      </div>
    );
  }

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
      <TicketHeader ticket={ticket} />

      <div className="content_padding">
        <div className="page_content">
          <div className="wrapper_box min_hight_box">
            <div className="row">
              <div className="col-lg-4 order-lg-2">
                <TicketDetails ticket={ticket} />
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
