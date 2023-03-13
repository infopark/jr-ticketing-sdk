import * as React from "react";

import i18n from "../../config/i18n";

function TicketListHeadEntry({ handleSort, sortKey }) {
  return (
    <div className="row ticket_list d-none d-md-block">
      <div className="col-xl-12">
        <div className="ticket_header radius">
          <div className="row">
            <div className="col-md-1">
              <div className="ticket-box">
                <button type="button" className="btn btn-filter" onClick={() => handleSort(sortKey === "byNumber" ? "reverseByNumber" : "byNumber")}>
                  {i18n.t("Ticket.labels.number")}
                  <SortIcon sortKey={sortKey} asc="byNumber" desc="reverseByNumber" />
                </button>
              </div>
            </div>

            <div className="col-md-5">
              <div className="ticket-box">
                {i18n.t("Ticket.labels.title")}
              </div>
            </div>

            <div className="col-md-2">
              <div className="ticket-box">
                <button type="button" className="btn btn-filter" onClick={() => handleSort(sortKey === "byCreatedAt" ? "reverseByCreatedAt" : "byCreatedAt")}>
                  {i18n.t("Ticket.labels.created_at")}
                  <SortIcon sortKey={sortKey} asc="byCreatedAt" desc="reverseByCreatedAt" />
                </button>
              </div>
            </div>

            <div className="col-md-2">
              <div className="ticket-box">
                <button type="button" className="btn btn-filter" onClick={() => handleSort(sortKey === "byUpdatedAt" ? "reverseByUpdatedAt" : "byUpdatedAt")}>
                  {i18n.t("Ticket.labels.updated_at")}
                  <SortIcon sortKey={sortKey} asc="byUpdatedAt" desc="reverseByUpdatedAt" />
                </button>
              </div>
            </div>

            <div className="col-md-2">
              <div className="ticket-box ticket-status-title">
                <button type="button" className="btn btn-filter">
                  {i18n.t("Ticket.labels.status")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortIcon({ sortKey, asc, desc }) {
  if (sortKey === asc) {
    return (<i className="ps-1 fa-solid fa-caret-up" />);
  } else if (sortKey === desc) {
    return (<i className="ps-1 fa-solid fa-caret-down" />);
  }

  return (<i className="ps-1 fa-solid fa-sort" />);
}

export default TicketListHeadEntry;
