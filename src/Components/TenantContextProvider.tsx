import * as Scrivito from "scrivito";
import React, { useState, useEffect } from "react";
import {
  each,
  head,
  isEmpty,
  isNil,
  keys,
  map,
  reduce,
  sortBy,
} from "lodash-es";

import { callApiGet } from "../api/portalApiCalls";
import i18n from "../config/i18n";
import addI18nBundles from "../config/addI18nBundles";

const TenantContext = React.createContext({} as any);

/**
 * Warning: This context provider uses tenant specific IDs in order to
 * manage meaningful defaults. Please use the provided contxt functions,
 * never access the IDs directly outside this module and simply add
 * additional functions to the context if necessary.
 */

const TicketAttributes = {
  "title": {
    type: "string",
    "ui:autofocus": true,
    "ui:required": true,
    "ui:regular": true
  },
  "message.text": {
    type: "string",
    "ui:widget": "textarea",
    "ui:required": true,
    "ui:regular": true
  },
  "message.attachments": {
    type: "array",
    items: {
      type: "string",
      format: "data-url"
    },
    "ui:regular": true
  }
};

export function TenantContextProvider(props) {
  const [customAttributes, setCustomAttributes] = React.useState({});
  const [ticketSchema, setTicketSchema] = useState<any>();
  const [ticketUiSchema, setTicketUiSchema] = useState<any>();

  const instanceId = process.env.SCRIVITO_TENANT;

  useEffect(() => {
    loadTicketFormConfiguration();
    loadConfiguration();
  }, []);

  const loadTicketFormConfiguration = () => {
    Scrivito.load(() => {
      const [obj] = Scrivito.Obj.onAllSites()
        .where("_objClass", "equals", "TicketFormConfiguration")
        .take(1);
      return obj;
    }).then((obj) => {
      const schema = JSON.parse(obj?.get("uiSchema") as string || "{}");
      setTicketUiSchema(schema);
    });
  }

  const loadConfiguration = async () => {
    try {
      const instance = await callApiGet("instance");

      setCustomAttributes(instance.custom_attributes);
      addI18nBundles(instance.locales);

      const customTicketProps = instance.custom_attributes.Ticket;
      setTicketSchemaForInstance({ ...TicketAttributes, ...customTicketProps });
    } catch (error) {
      setTicketSchemaForInstance({ ...TicketAttributes });
    }
  }

  const setTicketSchemaForInstance = (properties) => {
    Object.keys(properties).forEach((key) => {
      const prop = properties[key];

      prop.title = i18n.t(`Ticket.labels.${key}`);
      if (prop.enum) {
        prop.enumNames = prop.enum.map((value) => i18n.t(`Ticket.${key}.${value}`));
      }
    });

    setTicketSchema({
      type: "object",
      properties,
      required: Object.keys(properties).filter((name) => properties[name]["ui:required"]),
    });
  }

  function isTenantContextReady() {
    return !isEmpty(ticketSchema) && !isEmpty(ticketUiSchema);
  }

  return (
    <TenantContext.Provider
      value={{
        ticketSchema,
        ticketUiSchema,
        isTenantContextReady,
      }}
    >
      {props.children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  return React.useContext(TenantContext);
}
