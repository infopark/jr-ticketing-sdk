import React from "react";
import * as Scrivito from "scrivito";

import Loader from "../../Components/Loader";
import i18n from "../../config/i18n";

import TicketEntry, { Ticket } from "./TicketEntry";
import TicketListHeadEntry from "./TicketListHeadEntry";
import { ticketSorters } from "./utils";

function TicketList({
  handleSort,
  sortKey,
  ticketList,
  baseLink,
  loading,
  ticketFilters,
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
        <TicketListHeadEntry
          handleSort={handleSort}
          sortKey={sortKey}
        />
        <div className="text-center">{ i18n.t("No tickets available.") }</div>
      </>
    );
  }

  const sortedList: Ticket[] = ticketSorters[sortKey].sort(ticketList);
  const filteredList: Ticket[] = ticketFilters[filterKey].filter(sortedList);

  return (
    <>
      <TicketListHeadEntry
        handleSort={handleSort}
        sortKey={sortKey}
      />
      {filteredList.length <= 0 && (
        <div className="row ticket_list">
          <div className="col-xl-12">
            <div className="box_bg_white radius">
              <div className="box block text_center my-4">
                <p>
                  {i18n.t("TicketListWidget.empty")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {filteredList.map((ticket: Ticket, index: number) => {
        const targetLink = new Scrivito.Link({
          obj: baseLink,
          query: `id=${ticket.number}`,
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
