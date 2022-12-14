import React, { useState, useEffect, useRef } from "react";
import * as Scrivito from "scrivito";

import { callApiGet } from "../../api/portalApiCalls";
import { createTicketsListFilters } from "../../utils/listFilters";
import TicketList from "./TicketList";
import TicketListBoxHeader from "./TicketListBoxHeader";
import { useTenantContext } from "../../Components/TenantContextProvider";

Scrivito.provideComponent("TicketListWidget", (({ widget }) => {
  const [loading, setLoading] = useState(true);
  const [ticketList, setTicketList] = useState([]);
  const [sortKey, setSortKey] = useState("byCreationDate");
  const [filterKey, setFilterKey] = useState("active");
  const allowDeferredBaseLink = useRef(true);
  const { addError, userId } = useTenantContext();

  useEffect(() => {
    if (!userId) {
      return;
    }

    callApiGet(`tickets?filter[requester_id][eq]=${userId}`)
      .then((response) => {
        if (!response.failedRequest) {
          setTicketList(response);
        }
      })
      .catch((error) => {
        addError("Error loading ticket list", "TicketListWidget", error);
      })
      .finally(() => setLoading(false));
  }, [addError, userId]);

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
