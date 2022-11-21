import React, { useState, useEffect, useCallback, useRef } from "react";
import * as Scrivito from "scrivito";
import { callApiGet } from "../../api/portalApiCalls";
import useAPIError from "../../utils/useAPIError";
import { createTicketsListFilters } from "../../utils/listFilters";
import TicketList from "./TicketList";
import TicketListBoxHeader from "./TicketListBoxHeader";
import { getUserUuid } from "../../Components/Auth/utils";

Scrivito.provideComponent("TicketListWidget", (({ widget }) => {
  const [loading, setLoading] = useState(true);
  const [ticketList, setTicketList] = useState([]);
  const [sortKey, setSortKey] = useState("byCreationDate");
  const [filterKey, setFilterKey] = useState("active");
  const allowDeferredBaseLink = useRef(true);
  const { addError } = useAPIError();;

  const getTicketsByNewest = useCallback(() => {
    const userUUID = getUserUuid();
    callApiGet(`tickets?filter[requester_id][eq]=${userUUID}`)
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

  const ticketsListFilters = createTicketsListFilters(ticketList);
  const filterDisabled = false;

  return (
    <Scrivito.WidgetTag className="ticket-list-widget sdk">
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
      />
    </Scrivito.WidgetTag>
  );
}) as any);
