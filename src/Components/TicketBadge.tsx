import * as React from "react";
import i18n from "../config/i18n";

export default function TicketBadge({ ticket }) {
  return (
    <>
      {
        ticket.status === "new" && (
          <span className="badge badge-yellow">
            {i18n.t(ticket.status)}
          </span>
        )
      }
      {
        ticket.status === "open" && (
          <span className="badge badge-orange">
            {i18n.t(ticket.status)}
          </span>
        )
      }
      {
        ticket.status === "waiting" && (
          <span className="badge badge-blue">
            {i18n.t(ticket.status)}
          </span>
        )
      }
      {
        ticket.status === "closed" && (
          <span className="badge badge-grey">
            {i18n.t(`Ticket.status.${ticket.status}`)}
          </span>
        )
      }
    </>
  );
}
