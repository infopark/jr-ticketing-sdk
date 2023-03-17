import React from "react";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

import { parseDate } from "../../../utils/dateUtils";
import { DEFAULT_DATE_FORMAT } from "../../../utils/constants";
import i18n from "../../../config/i18n";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import { Keyable } from "../../../utils/types";

const TicketDetails = ({ ticket }) => {
  const {
    title,
    number,
    type,
    created_at,
    messages,
  } = ticket;
  const description = messages[0] ? messages[0].text : "";

  const { ticketSchema, ticketUiSchema } = useTenantContext();

  if (!ticketSchema || !ticketUiSchema) {
    return <>Loading ...</>;
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
    <div className="responsive-collapsible-content accordion" id="ticket-info">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button className="btn accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Ticket Info
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#ticket-info">
          <div className="accordion-body">
            <div className="text_content">
              <dl className="mb-3">
                <dt className="flex_order_1 bold">
                  {i18n.t("Ticket.labels.title")}
                </dt>
                <dd className="flex_order_2 item_label_content">
                  {sanitizeHtml(title)}
                </dd>
              </dl>
              <dl className="mb-3">
                <dt className="flex_order_1 bold">
                  {i18n.t("Ticket.labels.type")}
                </dt>
                <dd className="flex_order_2 item_label_content">
                  {i18n.t(`Ticket.type.${type}`)}
                </dd>
              </dl>
              <dl className="mb-3">
                <dt className="flex_order_1 bold">
                  {i18n.t("Ticket.labels.number")}
                </dt>
                <dd className="flex_order_2 item_label_content">
                  {number}
                </dd>
              </dl>
              <dl className="mb-3">
                <dt className="flex_order_1 bold">
                  {i18n.t("Ticket.labels.created_at")}
                </dt>
                <dd className="flex_order_2 item_label_content">
                  {parseDate(
                    created_at,
                    DEFAULT_DATE_FORMAT,
                  )}
                </dd>
              </dl>
              {customAttributes.map((name: string, index: number) => (
                <dl className="mb-3" key={`${index}-${name}`}>
                  <dt className="flex_order_1 bold">
                    {ticketSchema.properties[name].title || name}
                  </dt>
                  <dd className="flex_order_2 item_label_content">
                    {translateValue(name, ticket[name], ticketSchema.properties[name])}
                  </dd>
                </dl>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function translateValue(name: string, value: string | undefined, schema: Keyable) {
  if (schema.type === "array" && Array.isArray(value)) {
    return value.map((v) => translateValue(name, v, schema.items)).join(", ");
  } else if (value) {
    switch (schema.type) {
      case "string":
        if (schema.enum) {
          return i18n.t(`Ticket.${name}.${value}`);
        }
        switch (schema.format) {
          case "uri":
          case "data-url":
            return <a href={value} target="_blank" rel="noreferrer">{value}</a>;
          case "email":
            return <a href={`mailto:${value}`} target="_blank" rel="noreferrer">{value}</a>;
        }
        break;
      case "integer":
        return parseInt(value);
      case "float":
        return parseFloat(value);
    }
    return value;
  }
  return "-";
}

export default TicketDetails;
