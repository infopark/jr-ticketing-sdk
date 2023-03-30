import React from "react";
import i18n from "../config/i18n";

const StatusToColorMap = {
  new: "yellow",
  open: "orange",
  waiting: "blue",
  closed: "grey"
};

export default function TicketBadge({ ticket }) {
  return (
    <span className={`badge badge-${StatusToColorMap[ticket.status]}`}>
      {i18n.t(`Ticket.status.${ticket.status}`)}
    </span>
  );
}
