import React, { useState, useEffect } from "react";
import * as Scrivito from "scrivito";

import { callApiGet } from "../../api/portalApiCalls";
import useAPIError from "../../utils/useAPIError";
import { createDefaultTicketListFilter } from "../../utils/listFilters";
import TicketNumberBox from "./TicketNumberBox";
import CreateNewTicket from "./CreateNewTicket";
import { useTenantContext } from "../../Components/TenantContextProvider";
import i18n from "../../config/i18n";

Scrivito.provideComponent("TicketsWidget", (({ widget }) => {
  const [runningTickets, setRunningTickets] = useState(0);
  const { addError } = useAPIError();
  const { userId } = useTenantContext();

  useEffect(() => {
    callApiGet(`tickets?filter[requester_id][eq]=${userId}`)
      .then((response) => {
        if (!response.failedRequest) {
          const defaultFilter = createDefaultTicketListFilter();
          const filteredResponse = defaultFilter.filter(response);
          setRunningTickets(filteredResponse.length);
        }
      })
      .catch((error) => {
        addError("TICKET_LIST, ", error, "TicketListComponent");
      });
  }, [addError, userId]);

  const helpdeskPages = Scrivito.Obj.where("_objClass", "equals", "Page");
  const helpdeskPage = helpdeskPages.first();
  const link = widget.get("link") || helpdeskPage;
  const boxClassName = "col-sm-6";
  const chatPage = Scrivito.Obj.where(
    "_objClass",
    "equals",
    "ChatPage"
  ).first();

  return (
    <Scrivito.WidgetTag className="row equal sdk">
      <CreateNewTicket
        className={boxClassName}
        chatPage={chatPage}
        text={i18n.t("create_new_ticket")}
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
