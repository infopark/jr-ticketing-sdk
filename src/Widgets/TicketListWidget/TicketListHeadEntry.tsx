import * as React from "react";

import i18n from "../../config/i18n";

function TicketListHeadEntry() {
  return (
    <div className="row ticket_list d-none d-md-block">
      <div className="col-xl-12 box space_box">
        <div className="ticket_header radius">
          <div className="row">
            <div className="col-md-3">
              <div className="ticket-box">{i18n.t("ID")}</div>
            </div>

            <div className="col-md-3">
              <div className="ticket-box">{i18n.t("Description")}</div>
            </div>

            <div className="col-md-3">
              <div className="ticket-box ticket-status-title">
                {i18n.t("Status")}
              </div>
            </div>

            <div className="col-md-3">
              <div className="ticket-box">{i18n.t("Created")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketListHeadEntry;
