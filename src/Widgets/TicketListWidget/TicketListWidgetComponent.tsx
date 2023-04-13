import React from "react";
import * as Scrivito from "scrivito";

import TicketingApi from "../../api/TicketingApi";
import { useTicketingContext } from "../../Components/TicketingContextProvider";
import useWS from "../../utils/useWS";

import TicketList from "./TicketList";
import TicketListBoxHeader from "./TicketListBoxHeader";
import { ticketFilters } from "./utils";

Scrivito.provideComponent("TicketListWidget", (({ widget }) => {
  const [loading, setLoading] = React.useState(true);
  const [ticketList, setTicketList] = React.useState([]);
  const [sortKey, setSortKey] = React.useState("byNumber");
  const [filterKey, setFilterKey] = React.useState("active");
  const allowDeferredBaseLink = React.useRef(true);
  const { addError, currentUser } = useTicketingContext();
  const msg = useWS("users", currentUser?.id);

  const loadTickets = React.useCallback(async () => {
    try {
      const tickets = await TicketingApi.get(`tickets?filter[requester_id][eq]=${currentUser?.id}`);
      setTicketList(tickets);
    } catch (error) {
      addError("Error loading ticket list", "TicketListWidget", error);
    }
    setLoading(false);
  }, [currentUser?.id, addError, setTicketList]);

  React.useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    loadTickets();
  }, [msg, loadTickets, currentUser?.id]);

  const baseLink = widget!.get("link");
  if (!baseLink && allowDeferredBaseLink.current) {
    // chat page is not loaded yet
    allowDeferredBaseLink.current = false;
    Scrivito.load(() => widget!.get("link"));
  }

  const handleSort = (key) => {
    setSortKey(key);
  };

  const handleFilter = (event) => {
    setFilterKey(event.target.value);
  };

  return (
    <Scrivito.WidgetTag className="row jr-ticketing-sdk">
      <div className="col-lg-12 pt-2 mt-1">
        <TicketListBoxHeader
          active={!loading && !!baseLink}
          ticketFilters={ticketFilters}
          filterKey={filterKey}
          handleFilter={handleFilter}
          count={ticketList.length}
          total={ticketList.length}
        />
        <TicketList
          handleSort={handleSort}
          sortKey={sortKey}
          loading={loading || !baseLink}
          ticketList={ticketList}
          baseLink={baseLink}
          ticketFilters={ticketFilters}
          filterKey={filterKey}
        />
      </div>
    </Scrivito.WidgetTag>
  );
}) as React.ComponentType<Partial<Scrivito.WidgetComponentProps>>);
