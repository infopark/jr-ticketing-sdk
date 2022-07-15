import * as React from "react";
import * as Scrivito from "scrivito";

import attachmentIcon from "../../assets/images/icons/paperclip.svg";
import { dictTranslate, translate } from "../../utils/translate";
import { parseDate } from "../../utils/dateUtils";
import { DEFAULT_DATE_FORMAT } from "../../utils/constants";
import stripHtmlTags from "../../utils/stripHtmlTags";
import { useUserData } from "../../Components/UserDataContext";
import { validate as uuidValidate } from "uuid";

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
                  {!uuidValidate(ticket.ticketnum) ? ticket.ticketnum : ""}
                </span>
              </span>

              <span className="col-md-3">
                <span className="ticket-box">
                  <span className="ticket-title dots">{ticket.title}</span>
                  <span className="ticket-description dots">
                    {stripHtmlTags(ticket.description)}
                  </span>
                </span>
              </span>

              <span className="col-md-3">
                <span className="ticket-box ticket-status">
                  <span className="running-ticket">
                    {dictTranslate(ticket.status, statusDictionary)}
                  </span>
                </span>
              </span>

              <span className="col-md-3">
                <span className="ticket-box">
                  <span className="d-md-none">
                    {`${translate("Created on")} `}
                  </span>
                  {parseDate(
                    ticket.creationdate,
                    DEFAULT_DATE_FORMAT,
                    userData && userData.timelocale
                  )}
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
