import * as React from "react";

import parse from "html-react-parser";
import { getDictionary, dictTranslate } from "../../../utils/translate";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import stripHtmlTags from "../../../utils/stripHtmlTags";
import { useTenantLocalization } from "../../../Components/TenantContextProvider";

const TicketHeader = ({ ticket }) => {
  const { tenantLocalization } = useTenantLocalization();
  const statusDictionary = getDictionary(tenantLocalization);
  const status = ticket && ticket.status;
  return (
    <div className="ticket_info">
      <div className="row">
        <span className="wrapper_info_content no_wrap w-100">
          <span className="info_item extra_bold ticket-name dots">
            {ticket && ticket.title &&
              parse(newlinesToBreaks(stripHtmlTags(ticket && ticket.title)))}
          </span>
          <span className="info_item on_progress ticket-status dots float-right float-md-none">
            {dictTranslate(status, statusDictionary)}
          </span>
        </span>
      </div>
    </div>
  );
};

export default TicketHeader;
