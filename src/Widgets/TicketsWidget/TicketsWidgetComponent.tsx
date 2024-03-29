import React from "react";
import * as Scrivito from "scrivito";

import TicketingApi from "../../api/TicketingApi";
import { createDefaultTicketListFilter } from "../../utils/listFilters";
import TicketNumberBox from "./TicketNumberBox";
import CreateNewTicket from "./CreateNewTicket";
import { useTicketingContext } from "../../Components/TicketingContextProvider";
import i18n from "../../config/i18n";
import useWS from "../../utils/useWS";

Scrivito.provideComponent("TicketsWidget", (({ widget }) => {
  const [runningTickets, setRunningTickets] = React.useState(0);
  const { addError, currentUser } = useTicketingContext();
  const msg = useWS("users", currentUser?.id);

  const ticketUiSchema = JSON.parse(widget!.get("uiSchema") as string || "{}");

  const loadTickets = React.useCallback(async () => {
    try {
      const tickets = await TicketingApi.get(`tickets?filter[requester_id][eq]=${currentUser?.id}`);
      if (tickets) {
        const defaultFilter = createDefaultTicketListFilter();
        const filteredTickets = defaultFilter.filter(tickets);
        setRunningTickets(filteredTickets.length);
      }
    } catch (error) {
      addError("Error loading ticket list", "TicketListComponent", error);
    }
  }, [currentUser?.id, addError, setRunningTickets]);

  React.useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    loadTickets();
  }, [msg, loadTickets, currentUser?.id]);

  const helpdeskPages = Scrivito.Obj.where("_objClass", "equals", "Page");
  const helpdeskPage = helpdeskPages.first();
  const link = widget!.get("link") || helpdeskPage;
  const boxClassName = "col-sm-6";
  const ticketPage = Scrivito.Obj.where(
    "_objClass",
    "equals",
    "TicketPage"
  ).first();

  return (
    <Scrivito.WidgetTag className="row equal sdk">
      <CreateNewTicket
        className={boxClassName}
        ticketPage={ticketPage}
        text={i18n.t("CreateNewTicket.create_new_ticket")}
        ticketUiSchema={ticketUiSchema}
      />
      <TicketNumberBox
        todoBox={false}
        number={runningTickets}
        link={link}
        className={boxClassName}
        text={i18n.t("running_ticket")}
      />
    </Scrivito.WidgetTag>
  );
}) as React.ComponentType<Partial<Scrivito.WidgetComponentProps>>);
