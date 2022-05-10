import * as React from "react";

import { translate } from "../utils/translate";

function TicketListHeadEntry() {
  return (
    <div className="row ticket_list d-none d-md-block">
      <div className="col-xl-12 box space_box">
        <div className="ticket_header radius">
          <div className="row">
            <div className="col-md-3">
              <div className="ticket-box">{translate("ID")}</div>
            </div>

            <div className="col-md-3">
              <div className="ticket-box">{translate("Description")}</div>
            </div>

            <div className="col-md-3">
              <div className="ticket-box ticket-status-title">
                {translate("Status")}
              </div>
            </div>

            <div className="col-md-3">
              <div className="ticket-box">{translate("Created")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketListHeadEntry;
