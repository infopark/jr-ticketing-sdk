import React from "react";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import { parseDate } from "../../../utils/dateUtils";
import { DEFAULT_DATE_FORMAT } from "../../../utils/constants";
import i18n from "../../../config/i18n";
import { callApiPut } from "../../../api/portalApiCalls";
import { useUserData } from "../../../Components/UserDataContext";
import PageContentWrapper from "./PageContentWrapper";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import InnerPageContentWrapper from "./InnerPageContentWrapper";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";

const TicketDetails = ({ ticket, refreshCallback, isClosed }) => {
  const {
    id,
    title,
    number,
    type,
    status,
    created_at,
    messages,
  } = ticket;
  const { tenantLocalization, getInitialTicketStatusClosed } =
    useTenantContext();
  const { userData } = useUserData();

  const description = messages[0] ? messages[0].text : "";

  const handleCloseTicket = async (id) => {
    if (!isClosed) {
      const data = {
        status: "closed",
      };
      const response = await callApiPut(`tickets/${id}`, data);
      if (!response.failedRequest) {
        refreshCallback();
      }
    }
  };

  return (
    <PageContentWrapper>
      <InnerPageContentWrapper additionalBoxClass="box_bg_white">
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Ticket title")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {sanitizeHtml(title)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Description")}
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
            {i18n.t("Ticket Type")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {i18n.t(type)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Status")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {i18n.t(status)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Ticket Number")}
          </dt>
          <dd className="flex_order_2 item_label_content">{number}</dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Creation date")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {parseDate(
              created_at,
              DEFAULT_DATE_FORMAT,
              userData && userData.timelocale
            )}
          </dd>
        </dl>
      </InnerPageContentWrapper>
      <button
        className="btn btn-secondary"
        onClick={() => handleCloseTicket(id)}
        disabled={isClosed}
        type="button"
      >
        {i18n.t("Close Ticket")}
      </button>
    </PageContentWrapper>
  );
};

export default TicketDetails;
