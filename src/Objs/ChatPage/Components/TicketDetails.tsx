import React from "react";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import { parseDate } from "../../../utils/dateUtils";
import { DEFAULT_DATE_FORMAT } from "../../../utils/constants";
import i18n from "../../../config/i18n";
import { callApiPut } from "../../../api/portalApiCalls";
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

  const { ticketSchema, ticketUiSchema } = useTenantContext();

  if (!ticketSchema || !ticketUiSchema) {
    return <PageContentWrapper>Loading ...</PageContentWrapper>;
  }

  const customAttributesOrder = ticketUiSchema["ui:order"] || [];
  const customAttributes = Object.keys(ticketSchema.properties || {})
    .filter(name => !ticketSchema.properties[name]["ui:regular"])
    .filter(name => ticketUiSchema[name]?.["ui:details"] !== "hidden")
    .sort((a, b) => {
      const posA = (1 + customAttributesOrder.indexOf(a));
      const posB = (1 + customAttributesOrder.indexOf(b));
      return posA - posB;
    });

  return (
    <PageContentWrapper>
      <InnerPageContentWrapper additionalBoxClass="box_bg_white">
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Ticket.labels.title")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {sanitizeHtml(title)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Ticket.labels.message.text")}
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
            {i18n.t("Ticket.labels.type")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {i18n.t(`Ticket.type.${type}`)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Ticket.labels.status")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {i18n.t(`Ticket.status.${status}`)}
          </dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Ticket.labels.number")}
          </dt>
          <dd className="flex_order_2 item_label_content">{number}</dd>
        </dl>
        <dl className="table_style flex_grid">
          <dt className="flex_order_1 bold item_label">
            {i18n.t("Ticket.labels.created_at")}
          </dt>
          <dd className="flex_order_2 item_label_content">
            {parseDate(
              created_at,
              DEFAULT_DATE_FORMAT,
            )}
          </dd>
        </dl>
        {customAttributes.map(name => (
          <dl className="table_style flex_grid" key={name}>
            <dt className="flex_order_1 bold item_label">
              {ticketSchema.properties[name].title || name}
            </dt>
            <dd className="flex_order_2 item_label_content">
              {translateValue(name, ticket[name])}
            </dd>
          </dl>
        ))}
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

function translateValue(name, value) {
  if (Array.isArray(value)) {
    return value.map((v) => translateValue(name, v)).join(", ");
  } else if (value) {
    return i18n.t(`Ticket.${name}.${value}`, value);
  }
  return "-";
}

export default TicketDetails;
