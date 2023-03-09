import * as React from "react";
import TicketBadge from "../../../Components/TicketBadge";

const TicketHeader = ({ ticket }) => {
  return (
    <div className="scroll_header">
      <div className="ticket_info">
        <div className="row">
          <span className="wrapper_info_content no_wrap w-100">
            <span className="info_item extra_bold ticket-name dots">{ticket?.title}</span>
            <span className="info_item on_progress ticket-status dots float-right float-md-none">
              <TicketBadge ticket={ticket} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;
