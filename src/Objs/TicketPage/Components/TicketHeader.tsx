import * as React from "react";

import TicketBadge from "../../../Components/TicketBadge";
import i18n from "../../../config/i18n";
import { Keyable } from "../../../utils/types";

const TicketHeader = ({
  ticket,
}: {
  ticket: Keyable,
}) => {
  function goBack(e) {
    e.preventDefault();
    history.back();
  }

  return (
    <div className="scroll_header">
      <div className="ticket_info">
        <div className="row">
          <span className="wrapper_info_content no_wrap w-100">
            <span className="float-start">
              <a href="/" className="info_item" onClick={goBack}>
                <i className="fa fa-angle-left" />
                &nbsp;
                {i18n.t("TicketHeader.back")}
              </a>
            </span>
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
