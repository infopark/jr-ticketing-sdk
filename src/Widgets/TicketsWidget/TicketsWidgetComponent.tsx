import React, { useState, useEffect } from "react";
import * as Scrivito from "scrivito";

import TicketingApi from "../../api/TicketingApi";
import { createDefaultTicketListFilter } from "../../utils/listFilters";
import TicketNumberBox from "./TicketNumberBox";
import CreateNewTicket from "./CreateNewTicket";
import { useTenantContext } from "../../Components/TenantContextProvider";
import i18n from "../../config/i18n";
import useWS from "../../utils/useWS";

Scrivito.provideComponent("TicketsWidget", (({ widget }) => {
  const [runningTickets, setRunningTickets] = useState(0);
  const { addError, userId } = useTenantContext();
  const msg = useWS("users", userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    TicketingApi.get(`tickets?filter[requester_id][eq]=${userId}`)
      .then((response) => {
        if (!response.failedRequest) {
          const defaultFilter = createDefaultTicketListFilter();
          const filteredResponse = defaultFilter.filter(response);
          setRunningTickets(filteredResponse.length);
        }
      })
      .catch((error) => {
        addError("Error loading ticket list", "TicketListComponent", error);
      });
  }, [msg, addError, userId]);

  const helpdeskPages = Scrivito.Obj.where("_objClass", "equals", "Page");
  const helpdeskPage = helpdeskPages.first();
  const link = widget.get("link") || helpdeskPage;
  const boxClassName = "col-sm-6";
  const chatPage = Scrivito.Obj.where(
    "_objClass",
    "equals",
    "TicketPage"
  ).first();

  return (
    <Scrivito.WidgetTag className="row equal sdk">
      <CreateNewTicket
        className={boxClassName}
        chatPage={chatPage}
        text={i18n.t("CreateNewTicket.create_new_ticket")}
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
}) as any);
