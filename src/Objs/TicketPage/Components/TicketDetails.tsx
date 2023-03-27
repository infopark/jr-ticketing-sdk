import React from "react";
import sanitizeHtml from "sanitize-html";

import i18n from "../../../config/i18n";
import { formatRelative } from "../../../utils/dateUtils";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import { Keyable } from "../../../utils/types";
import { Accordion } from "react-bootstrap";

const TicketDetails = ({ ticket }) => {
  const {
    title,
    number,
    type,
    created_at,
  } = ticket;
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
    <Accordion defaultActiveKey="0" className="responsive-collapsible-content">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          Ticket Info
        </Accordion.Header>
        <Accordion.Body>
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
                {formatRelative(created_at)}
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
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

function translateValue(name: string, value: string | undefined, schema: Keyable) {
  if (schema.type === "array" && Array.isArray(value)) {
    return value.map((v) => translateValue(name, v, schema.items)).join(", ");
  } else if (value) {
    switch (schema.type) {
      case "string":
        switch (schema.format) {
          case "uri":
          case "data-url":
            return <a href={value} target="_blank" rel="noreferrer">{value}</a>;
          case "email":
            return <a href={`mailto:${value}`} target="_blank" rel="noreferrer">{value}</a>;
          default:
            return i18n.t(`Ticket.${name}.${value}`, value);
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
