/* eslint-disable no-console */
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import * as Scrivito from "scrivito";

import { callApiGet } from "../../api/portalApiCalls";
import Loader from "../../Components/Loader";
import { isInVisitedPages, addToVisitedPages } from "../../utils/visitedPages";
import CommunicationTree from "./Components/CommunicationTree";
import MessageArea from "./Components/MessageArea";
import TicketDetails from "./Components/TicketDetails";
import TicketHeader from "./Components/TicketHeader";
import TicketNav from "./Components/TicketNav";
import i18n from "../../config/i18n";
import { Keyable } from "../../utils/types";

const TICKET_NOT_FOUND = { status: "ticket-not-found" };

const viewModes = {
  details: { name: "details", clickable: true },
  chat: { name: "chat", clickable: true },
};

Scrivito.provideComponent("ChatPage", ({ page }) => {
  const [chatContent, setChatContent] = useState<Keyable[]>();
  const [ticket, setTicket] = useState<Keyable>();
  const [status, setStatus] = useState<string>("idle");
  const [mode, setMode] = useState<string>("chat");
  const ws = useRef<Keyable | null>(null);
  const wsApiUrl = process.env.WS_API_BASE_URL;
  const stage = process.env.API_DEPLOYMENT_STAGE;

  const createWebsocket = useCallback(
    (effectStatus) => {
      let wsOpened = false;
      const refreshTicket = getTicket;
      const urlParams = new URLSearchParams(window.location.search);
      const ticketid = urlParams.get("ticketid");

      ws.current = new WebSocket(`${wsApiUrl}/${stage}`);
      ws.current.onopen = () => {
        wsOpened = true;
        ws.current?.send(
          JSON.stringify({
            action: "registerTicketId",
            ticketId: ticketid,
            instanceId:
              process.env.API_INSTANCE_ID || "00000000000000000000000000000000",
          })
        );
      };
      ws.current.onmessage = () => {
        refreshTicket(effectStatus);
      };
      ws.current.onerror = () => {
        if (!wsOpened && ws.current) {
          ws.current.onclose = null;
        }
      };
      ws.current.onclose = createWebsocket;
    },
    [wsApiUrl, stage]
  );

  // TODO websockets
  // useEffect(() => {
  //   const effectStatus = { canceled: false };
  //   createWebsocket(effectStatus);

  //   return () => {
  //     effectStatus.canceled = true;
  //     ws.current.onclose = null;
  //     ws.current.close();
  //   };
  // }, [createWebsocket]);

  const getTicket = async (effectStatus) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ticketid = urlParams.get("ticketid");
      const ticket =
        ticketid && (
          await callApiGet(`tickets/${ticketid}?include=messages`)
            .then((data) => {
              if (data.failedRequest || effectStatus.canceled) {
                return TICKET_NOT_FOUND;
              }
              const ticketData = data;
              const { messages } = ticketData;
              setChatContent(messages);
              return ticketData;
            })
            .finally(() => setStatus("idle")));

      if (effectStatus.canceled) {
        return;
      }
      setTicket(ticket);

      if (wasTicketCreatedLessThanMsAgo(ticket, 1000)) {
        // ask again about the ticket details, it was created just now
        setTimeout(() => {
          callApiGet(`tickets/${ticketid}`)
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
  }, [getTicketCallback, history]);

  useEffect(() => {
    document.body.classList.toggle("savepoint", mode === "details");
  }, [mode]);


  const refreshCallback = async () => {
    setStatus("uploading");
    getTicketCallback({ canceled: false });
    setStatus("idle");
  };

  const applyRememberedScrollPosition = useCallback(() => {
    const scrollPosition = parseInt(
      window.sessionStorage.getItem(`chat-page-${mode}-scroll-position`)!,
      10
    );
    if (!isNaN(scrollPosition)) {
      window.scrollTo(0, scrollPosition);
    }
  }, [mode]);

  const removeRememberedScrollPositions = useCallback(() => {
    Object.keys(viewModes).forEach((viewMode) => {
      window.sessionStorage.removeItem(`chat-page-${viewMode}-scroll-position`);
    });
  }, [viewModes]);

  useEffect(applyRememberedScrollPosition, [applyRememberedScrollPosition]);

  useEffect(
    () => removeRememberedScrollPositions,
    [removeRememberedScrollPositions]
  );

  useEffect(() => {
    saveScrollPosition();
    window.addEventListener("scroll", saveScrollPosition);
    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      window.sessionStorage.removeItem("scroll-position");
    };
  }, []);

  const rememberScrollPosition = () => {
    const scrollPosition = window.sessionStorage.getItem("scroll-position");
    window.sessionStorage.setItem(
      `chat-page-${mode}-scroll-position`,
      scrollPosition!
    );
  };

  const toggleMode = (mod) => {
    rememberScrollPosition();
    setMode(mod);
  };

  if (ticket === TICKET_NOT_FOUND) {
    return (
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
    );
  }

  if (!ticket) {
    return (
      <div className="sdk white-bg-loader">
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
    <>
      <div className="col-lg-12 sdk sdk-ticket-details">
        <div className="scroll_header animate">
          <TicketHeader ticket={ticket} />
          <TicketNav mode={mode} toggleMode={toggleMode} viewModes={viewModes} />
        </div>
        {mode === "chat" && chatContent && (
          <CommunicationTree
            messages={ticket.messages}
            status={status}
            mode={mode}
          />
        )}
        {mode === "details" && (
          <TicketDetails ticket={ticket}/>
        )}
      </div>
      {mode === "chat" && (
        <MessageArea
          ticketId={ticket.id}
          refreshCallback={refreshCallback}
          isClosed={isTicketClosed}
        />
      )}
    </>
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
