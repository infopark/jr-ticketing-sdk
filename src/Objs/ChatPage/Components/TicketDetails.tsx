import React from "react";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import { parseDate } from "../../../utils/dateUtils";
import { DEFAULT_DATE_FORMAT } from "../../../utils/constants";
import {
  translate,
  getDictionary,
  dictTranslate,
} from "../../../utils/translate";
import { callApiPost } from "../../../api/portalApiCalls";
import { useUserData } from "../../../Components/UserDataContext";
import PageContentWrapper from "./PageContentWrapper";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import InnerPageContentWrapper from "./InnerPageContentWrapper";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";

const TicketDetails = ({ ticket, refreshCallback, isClosed }) => {
  const {
    title,
    description,
    creationdate,
    ticketid,
    status,
    ticketnum,
    tickettype,
  } = ticket;
  const { tenantLocalization, getInitialTicketStatusClosed } =
    useTenantContext();
  const statusDictionary = getDictionary(tenantLocalization);
  const { userData } = useUserData();

  const handleCloseTicket = async (id) => {
    if (!isClosed) {
      const data = {
        status: getInitialTicketStatusClosed(tickettype),
      };
      const response = await callApiPost(`update-ticket/${id}`, data);
      if (response.status === "ticketUpdated") {
        refreshCallback();
      }
    }
  };

  return (
    <PageContentWrapper>
      <InnerPageContentWrapper additionalBoxClass="box_bg_white">
        {/* extract this into a separate component and make it as a default  */}
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {translate("Ticket title")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {sanitizeHtml(title)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {translate("Description")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {parse(
              sanitizeHtml(newlinesToBreaks(description), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
              })
            )}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {translate("Ticket Type")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {dictTranslate(tickettype, statusDictionary)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {translate("Status")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {dictTranslate(status, statusDictionary)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {translate("Ticket Number")}
          </dt>
          <dd className="flex_order_2 item_label_content">{ticketnum}</dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {translate("Creation date")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {parseDate(
              creationdate,
              DEFAULT_DATE_FORMAT,
              userData && userData.timelocale
            )}
          </dd>
        </dl>
      </InnerPageContentWrapper>
      <button
        className="btn btn-secondary"
        onClick={() => handleCloseTicket(ticketid)}
        disabled={isClosed}
        type="button"
      >
        {translate("Close Ticket")}
      </button>
    </PageContentWrapper>
  );
};

export default TicketDetails;
