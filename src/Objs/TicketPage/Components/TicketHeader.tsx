import * as React from "react";
import * as Scrivito from "scrivito";

import TicketBadge from "../../../Components/TicketBadge";
import i18n from "../../../config/i18n";
import { Keyable } from "../../../utils/types";

const TicketHeader = ({
  ticket,
  page,
}: {
  ticket: Keyable,
  page: Scrivito.Obj,
}) => {
  const [parent, setParent] = React.useState<Scrivito.Obj>();
  Scrivito.load(() => setParent(page.parent() as Scrivito.Obj));

  return (
    <div className="scroll_header">
      <div className="ticket_info">
        <div className="row">
          <span className="wrapper_info_content no_wrap w-100">
            <span className="float-start">
            <Scrivito.LinkTag to={parent} className="info_item">
                <i className="fa fa-angle-left" />
                &nbsp;
                {i18n.t("TicketHeader.back")}
              </Scrivito.LinkTag>
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
