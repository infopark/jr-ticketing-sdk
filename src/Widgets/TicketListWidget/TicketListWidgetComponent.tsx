import React, { useState, useEffect, useCallback, useRef } from "react";
import * as Scrivito from "scrivito";
import { callApiPost } from "../../api/portalApiCalls";
import useAPIError from "../../utils/useAPIError";
import {
  createTicketsListFilters,
  isTicketListFilterDisabled,
} from "../../utils/listFilters";
import TicketList from "./TicketList";
import TicketListBoxHeader from "./TicketListBoxHeader";
import { getUserUuid } from "../../Components/Auth/utils";
import { useTenantLocalization } from "../../Components/TenantContextProvider";
import { getDictionary } from "../../utils/translate";

Scrivito.provideComponent("TicketListWidget", (({ widget }) => {
  const [loading, setLoading] = useState(true);
  const [ticketList, setTicketList] = useState([]);
  const [sortKey, setSortKey] = useState("byCreationDate");
  const [filterKey, setFilterKey] = useState("active");
  const allowDeferredBaseLink = useRef(true);
  const { tenantLocalization, isTicketStatusClosed } = useTenantLocalization();
  const statusDictionary = getDictionary(tenantLocalization);
  const { addError } = useAPIError();

  const getTicketsByNewest = useCallback(() => {
    const userUUID = getUserUuid();
    callApiPost(`get-tickets/${userUUID}`, { withAttachmentCount: true })
      .then((response) => {
        if (!response.failedRequest) {
          setTicketList(response);
        }
      })
      .catch((error) => {
        addError("TICKET_LIST, ", error, "TicketListWidget");
      })
      .finally(() => setLoading(false));
  }, [addError]);

  // initial load tickets
  useEffect(() => {
    getTicketsByNewest();
  }, [getTicketsByNewest]);

  const baseLink = widget.get("link");
  if (!baseLink && allowDeferredBaseLink.current) {
    // chat page is not loaded yet
    allowDeferredBaseLink.current = false;
    Scrivito.load(() => widget.get("link"));
  }

  const handleSort = (event) => {
    setSortKey(event.target.value);
  };

  const handleFilter = (event) => {
    setFilterKey(event.target.value);
  };

  const ticketsListFilters = createTicketsListFilters(
    ticketList,
    statusDictionary,
    isTicketStatusClosed
  );

  const filterDisabled = isTicketListFilterDisabled(
    ticketsListFilters,
    ticketList,
    isTicketStatusClosed
  );

  return (
    <Scrivito.WidgetTag className="ticket-list-widget">
      <TicketListBoxHeader
        widget={widget}
        handleSort={handleSort}
        sortKey={sortKey}
        active={!loading && !!baseLink}
        ticketsListFilters={ticketsListFilters}
        filterKey={filterKey}
        handleFilter={handleFilter}
        filterDisabled={filterDisabled}
      />
      <TicketList
        loading={loading || !baseLink}
        ticketList={ticketList}
        sortKey={sortKey}
        baseLink={baseLink}
        widgetId={widget.id()}
        ticketsListFilters={ticketsListFilters}
        filterKey={filterKey}
        statusDictionary={statusDictionary}
      />
    </Scrivito.WidgetTag>
  );
}) as any);
