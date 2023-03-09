import * as React from "react";

import { ticketsListSorters } from "../../utils/listSorters";
import i18n from "../../config/i18n";

function TicketListHeadEntry({
  active,
  handleSort,
  sortKey,
}) {
  const sortKeys = Object.keys(ticketsListSorters);

  return (
    <div className="row ticket_list d-none d-md-block">
      <div className="col-xl-12">
        <div className="ticket_header radius">
          <div className="row">
            <div className="col-md-1">
              <div className="ticket-box">
                {i18n.t("Ticket.labels.number")}
              </div>
            </div>

            <div className="col-md-5">
              <div className="ticket-box">
                {i18n.t("Ticket.labels.title")}
              </div>
            </div>

            <div className="col-md-2">
              <div className="ticket-box">
                <button type="button" className="btn btn-filter" disabled={!active} onClick={() => handleSort(sortKey === "byCreationDate" ? "reverseByCreationDate" : "byCreationDate")}>
                  {i18n.t("Ticket.labels.created_at")}
                  {sortKey === "byCreationDate" && <i className="ps-1 fa-solid fa-caret-up" />}
                  {sortKey === "reverseByCreationDate" && <i className="ps-1 fa-solid fa-caret-down" />}
                </button>
              </div>
            </div>

            <div className="col-md-2">
              <div className="ticket-box">
                <button type="button" className="btn btn-filter">
                  {i18n.t("Ticket.labels.updated_at")}
                  {/*<i className="ps-1 fa-solid fa-caret-up" />*/}
                  {/*<i className="ps-1 fa-solid fa-caret-down" />*/}
                </button>
              </div>
            </div>

            <div className="col-md-2">
              <div className="ticket-box ticket-status-title">
                <button type="button" className="btn btn-filter">
                  {i18n.t("Ticket.labels.status")}
                  {/*<i className="ps-1 fa-solid fa-caret-up" />*/}
                  {/*<i className="ps-1 fa-solid fa-caret-down" />*/}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketListHeadEntry;
