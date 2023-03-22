import * as React from "react";
import * as Scrivito from "scrivito";

import { formatRelative } from "../../utils/dateUtils";
import i18n from "../../config/i18n";
import TicketBadge from "../../Components/TicketBadge";

import attachmentIcon from "../../assets/images/icons/paperclip.svg";

export interface Ticket {
  id: string;
  title: string;
  type: string;
  status: string;
  number: number;
  attachmentcount: number;
  created_at: string;
  updated_at: string;
}

function AttachmentFlag({ count }) {
  return (
    <span className="attachment-flag badge d-flex align-items-center">
      <img src={attachmentIcon} alt="paperclip" />
      <span className="d-block ml-1">{count}</span>
    </span>
  );
}

function TicketEntry({
  ticket,
  targetLink,
}: {
  ticket: Ticket,
  targetLink: Scrivito.Link
}) {
  return (
    <div className="row ticket_list">
      <div className="col-xl-12">
        <div className="box_bg_white radius">
          <Scrivito.LinkTag to={targetLink} className="box block">
            <span className="row">
              <span className="col-md-1">
                <span className="ticket-box dots">
                  {ticket.attachmentcount > 0 && (
                    <AttachmentFlag count={ticket.attachmentcount} />
                  )}
                  {ticket.number}
                </span>
              </span>

              <span className="col-md-5">
                <span className="ticket-box">
                  <span className="ticket-description dots">
                    {ticket.title}
                  </span>
                </span>
              </span>

              <span className="col-md-2">
                <span className="ticket-box dots">
                  <span className="d-md-none">
                    {i18n.t("Ticket.labels.created_at")}
                  </span>
                  &nbsp;
                  <span className="d-md-none">
                    {formatRelative(ticket.created_at, true)}
                  </span>
                  <span className="d-none d-md-inline">
                    {formatRelative(ticket.created_at)}
                  </span>
                </span>
              </span>

              <span className="col-md-2">
                <span className="ticket-box dots">
                  <span className="d-md-none">
                    {i18n.t("Ticket.labels.updated_at")}
                  </span>
                  &nbsp;
                  <span className="d-md-none">
                    {formatRelative(ticket.updated_at, true)}
                  </span>
                  <span className="d-none d-md-inline">
                    {formatRelative(ticket.updated_at)}
                  </span>
                </span>
              </span>

              <span className="col-md-2">
                <span className="ticket-box ticket-status">
                  <TicketBadge ticket={ticket} />
                </span>
              </span>
            </span>
          </Scrivito.LinkTag>
        </div>
      </div>
    </div>
  );
}

export default TicketEntry;
