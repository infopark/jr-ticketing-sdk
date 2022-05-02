import * as React from "react";
import * as Scrivito from "scrivito";
import paperclipIcon from "../assets/images/icons/paperclip.svg";
import { translate } from "../utils/translate";

interface ticketEntryProps {
  ticket: {
    status: string;
    creationdate: string;
    title: string;
    description: string;
    attachmentcount: number;
    ticketnum: string;
  };
  targetLink: Scrivito.Link;
  statusDictionary: object;
  userData: {
    timelocale: string;
  };
}

export function TicketEntry({
  ticket,
  targetLink,
  statusDictionary,
  userData,
}: ticketEntryProps) {
  return (
    <div className="row ticket_list">
      <div className="col-xl-12 box space_box">
        <div className="box_bg_white radius">
          <Scrivito.LinkTag className="box block" to={targetLink}>
            <span className="row">
              <span className="col-md-3">
                <span className="ticket-box with-attachment-flag">
                  {ticket.attachmentcount > 0 && (
                    <span className="attachment-flag badge d-flex align-items-center">
                      <img src={paperclipIcon} alt="paperclip" height="14" />
                      <span className="d-block ml-1">
                        {ticket.attachmentcount}
                      </span>
                    </span>
                  )}
                  {ticket.ticketnum}
                </span>
              </span>
              <span className="col-md-3">
                <span className="ticket-box">
                  <span className="ticket-title dots">{ticket.title}</span>
                  <span className="ticket-description dots">
                    {ticket.description}
                  </span>
                </span>
              </span>
              <span className="col-md-3">
                <span className="ticket-box ticket-status">
                  <span className="running-ticket">{ticket.status}</span>
                </span>
              </span>
              <span className="col-md-3">
                <span className="ticket-box">
                  <span className="d-md-none">{translate("Created on")}</span>
                  {ticket.creationdate}
                </span>
              </span>
            </span>
          </Scrivito.LinkTag>
        </div>
      </div>
    </div>
  );
}
