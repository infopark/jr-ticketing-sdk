import * as React from "react";
import * as Scrivito from "scrivito";

import Loader from "../../Components/Loader";
import { ticketsListSorters } from "../../utils/listSorters";
import i18n from "../../config/i18n";

import TicketEntry from "./TicketEntry";
import TicketListHeadEntry from "./TicketListHeadEntry";

function TicketList({
  ticketList,
  sortKey,
  baseLink,
  widgetId,
  loading,
  ticketsListFilters,
  filterKey,
}) {
  if (loading) {
    return (
      <div className="sdk loader_overlay">
        <Loader bg="bg_color_transparent" />
      </div>
    );
  }
  if (ticketList.length === 0) {
    return (
      <>
        <TicketListHeadEntry />
        <div className="text-center">{i18n.t("No tickets available.")}</div>
      </>
    );
  }

  const sortedList = ticketsListSorters[sortKey].sorter(ticketList);
  const filteredList = ticketsListFilters[filterKey].filter(sortedList);

  return (
    <>
      <TicketListHeadEntry />
      {filteredList.map((ticket, index) => {
        const targetLink = new Scrivito.Link({
          obj: baseLink,
          query: `ticketid=${ticket.id}`,
        });

        return (
          <TicketEntry
            ticket={ticket}
            targetLink={targetLink}
            key={index}
          />
        );
      })}
    </>
  );
}
export default TicketList;
