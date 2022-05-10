import * as React from "react";
import * as Scrivito from "scrivito";

import Loader from "./Loader";
import { ticketsListSorters } from "../utils/listSorters";
import { TicketEntry } from "./TicketEntry";
import { translate } from "../utils/translate";
import TicketListHeadEntry from "./TicketListHeadEntry";
// import { useUserData } from "./UserDataContext";

function TicketList({
  ticketList,
  sortKey,
  baseLink,
  widgetId,
  loading,
  ticketsListFilters,
  filterKey,
  statusDictionary,
}) {
  const userData = { timelocale: "de-DE" };

  if (loading) {
    return (
      <div className="loader_overlay">
        <Loader bg="bg_color_transparent" />
      </div>
    );
  }

  if (ticketList.length === 0) {
    return (
      <>
        <TicketListHeadEntry />
        <div className="text-center">{translate("No tickets available.")}</div>
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
          query: `ticketid=${ticket.ticketid}`,
        });
        return (
          <TicketEntry
            ticket={ticket}
            targetLink={targetLink}
            key={index}
            statusDictionary={statusDictionary}
            userData={userData}
          />
        );
      })}
    </>
  );
}
export default TicketList;
