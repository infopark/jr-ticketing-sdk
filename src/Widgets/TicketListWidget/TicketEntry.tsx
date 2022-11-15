import * as React from "react";
import * as Scrivito from "scrivito";

import attachmentIcon from "../../assets/images/icons/paperclip.svg";
import i18n from "../../config/i18n";
import { parseDate } from "../../utils/dateUtils";
import { DEFAULT_DATE_FORMAT } from "../../utils/constants";
import stripHtmlTags from "../../utils/stripHtmlTags";
import { useUserData } from "../../Components/UserDataContext";

interface ticketEntryProps {
  ticket: {
    id: string;
    title: string;
    type: string;
    status: string;
    // description: string;
    number: number;
    attachmentcount: number;
    created_at: string;
    updated_at: string;
  };
  targetLink: Scrivito.Link;
  statusDictionary: object;
}

function AttachmentFlag({ count }) {
  return (
    <span className="attachment-flag badge d-flex align-items-center">
      <img src={attachmentIcon} alt="paperclip" height="14" />
      <span className="d-block ml-1">{count}</span>
    </span>
  );
}

function TicketEntry({
  ticket,
  targetLink,
  statusDictionary,
}: ticketEntryProps) {
  const { userData } = useUserData();
  const creationDate = parseDate(
    ticket.created_at,
    DEFAULT_DATE_FORMAT,
    userData && userData.timelocale
  );

  return (
    <div className="row ticket_list">
      <div className="col-xl-12 box space_box">
        <div className="box_bg_white radius">
          <Scrivito.LinkTag to={targetLink} className="box block">
            <span className="row">
              <span className="col-md-3 relative">
                <span className="ticket-box with-attachment-flag">
                  {ticket.attachmentcount > 0 && (
                    <AttachmentFlag count={ticket.attachmentcount} />
                  )}
                  {ticket.number}
                </span>
              </span>

              <span className="col-md-3">
                <span className="ticket-box">
                  <span className="ticket-title dots">{ticket.title}</span>
                  <span className="ticket-description dots">
                    {stripHtmlTags("TODO ticket description")}
                  </span>
                </span>
              </span>

              <span className="col-md-3">
                <span className="ticket-box ticket-status">
                  <span className="running-ticket">
                    {i18n.t(ticket.status)}
                  </span>
                </span>
              </span>

              <span className="col-md-3">
                <span className="ticket-box">
                  <span className="d-md-none">
                    {i18n.t("Created on")}
                  </span>
                  {creationDate}
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
