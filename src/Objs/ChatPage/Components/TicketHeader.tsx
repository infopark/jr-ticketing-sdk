import * as React from "react";

import I18n from "../../../config/I18n";

const TicketHeader = ({ ticket }) => {
  const status = ticket && ticket.status;
  return (
    <div className="ticket_info">
      <div className="row">
        <span className="wrapper_info_content no_wrap w-100">
          <span className="info_item extra_bold ticket-name dots">
            {ticket && ticket.title}
          </span>
          <span className="info_item on_progress ticket-status dots float-right float-md-none">
            {I18n.t(status)}
          </span>
        </span>
      </div>
    </div>
  );
};

export default TicketHeader;
