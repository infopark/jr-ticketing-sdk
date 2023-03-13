import React, { useState, useEffect, useRef } from "react";
import * as Scrivito from "scrivito";

import TicketingApi from "../../api/TicketingApi";
import { useTenantContext } from "../../Components/TenantContextProvider";
import useWS from "../../utils/useWS";

import TicketList from "./TicketList";
import TicketListBoxHeader from "./TicketListBoxHeader";
import { ticketFilters } from "./utils";

Scrivito.provideComponent("TicketListWidget", (({ widget }) => {
  const [loading, setLoading] = useState(true);
  const [ticketList, setTicketList] = useState([]);
  const [sortKey, setSortKey] = useState("byNumber");
  const [filterKey, setFilterKey] = useState("active");
  const allowDeferredBaseLink = useRef(true);
  const { addError, userId } = useTenantContext();
  const msg = useWS("users", userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    TicketingApi.get(`tickets?filter[requester_id][eq]=${userId}`)
      .then((response) => {
        if (!response.failedRequest) {
          setTicketList(response);
        }
      })
      .catch((error) => {
        addError("Error loading ticket list", "TicketListWidget", error);
      })
      .finally(() => setLoading(false));
  }, [msg, addError, userId]);

  const baseLink = widget.get("link");
  if (!baseLink && allowDeferredBaseLink.current) {
    // chat page is not loaded yet
    allowDeferredBaseLink.current = false;
    Scrivito.load(() => widget.get("link"));
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
          widget={widget}
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
}) as any);
