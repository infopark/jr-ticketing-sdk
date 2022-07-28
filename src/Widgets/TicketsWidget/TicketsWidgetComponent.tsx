import React, { useState, useEffect } from "react";
import * as Scrivito from "scrivito";
import { translate } from "../../utils/translate";
import { callApiPost } from "../../api/portalApiCalls";
import useAPIError from "../../utils/useAPIError";
import { createDefaultTicketListFilter } from "../../utils/listFilters";
import TicketNumberBox from "./TicketNumberBox";
import CreateNewTicket from "./CreateNewTicket";
import { getUserUuid } from "../../Components/Auth/utils";
import { useTenantLocalization } from "../../Components/TenantContextProvider";

const FORM_FIELDS = ["tickettype", "title", "description", "attachment"];

Scrivito.provideComponent("TicketsWidget", (({ widget }) => {
  const [runningTickets, setRunningTickets] = useState(0);
  const { addError } = useAPIError();
  const userUUID = getUserUuid();
  const { isTicketStatusClosed } = useTenantLocalization();

  useEffect(() => {
    callApiPost(`get-tickets/${userUUID}`, {})
      .then((response) => {
        if (!response.failedRequest) {
          const defaultFilter =
            createDefaultTicketListFilter(isTicketStatusClosed);
          const filteredResponse = defaultFilter.filter(response);
          setRunningTickets(filteredResponse.length);
        }
      })
      .catch((error) => {
        addError("TICKET_LIST, ", error, "TicketListComponent");
      });
  }, [addError, userUUID, isTicketStatusClosed]);

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
        text={translate("create_new_ticket")}
        formFields={FORM_FIELDS}
      />
      <TicketNumberBox
        todoBox={false}
        number={runningTickets}
        link={link}
        className={boxClassName}
        text={translate("running_ticket")}
      />
    </Scrivito.WidgetTag>
  );
}) as any);
