import * as Scrivito from "scrivito";
import React, { useState, useEffect, useCallback } from "react";
import { isEmpty } from "lodash-es";

import { callApiGet } from "../api/portalApiCalls";
import useAPIError from "../utils/useAPIError";
import getUserData from "../api/getUserData";
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
  const [customAttributes, setCustomAttributes] = React.useState<any>({});
  const [ticketSchema, setTicketSchema] = useState<any>();
  const [ticketUiSchema, setTicketUiSchema] = useState<any>();

  const [language, setLanguage] = useState("en");
  const [userData, setUserData] = useState(undefined as any);
  const [userId, setUserId] = useState(null);

  const instanceId = process.env.SCRIVITO_TENANT;
  const { addError } = useAPIError();

  useEffect(() => {
    loadTicketFormConfiguration();
    loadConfiguration();
  }, []);

  useEffect(() => {
    if (ticketUiSchema && customAttributes) {
      try {
        const customTicketProps = {};
        const order = ticketUiSchema["ui:order"] || [];
        Object.entries(customAttributes.Ticket).forEach(([name, schema]) => {
          if (order.indexOf(name) >= 0) {
            customTicketProps[name] = schema;
          }
        });
        setTicketSchemaForInstance({ ...TicketAttributes, ...customTicketProps });
      } catch (error) {
        setTicketSchemaForInstance({ ...TicketAttributes });
      }
    }
  }, [ticketUiSchema, customAttributes]);

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
    const instance = await callApiGet("instance");

    setCustomAttributes(instance.custom_attributes);
    addI18nBundles(instance.locales);
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

  const loadUserInfo = async () => {
    try {
      const data = await getUserData();
      if (!data) {
        setUserId(null);
        return;
      }

      if (data.failedRequest) {
        setUserId(null);
        if (data.tooManyIamRedirects) {
          setUserData(data);
        }
        return;
      }

      setUserId(data.id);
      setUserData(data);
    } catch (error) {
      addError("LOAD_DATA_ERROR, ", error, "UserDataContext");
    }
  }

  function isTenantContextReady() {
    return !isEmpty(ticketSchema) && !isEmpty(ticketUiSchema);
  }

  const updateLanguage = useCallback((language) => {
    // TODO update I18n
    setLanguage(language);
  }, []);

  return (
    <TenantContext.Provider
      value={{
        customAttributes,
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
