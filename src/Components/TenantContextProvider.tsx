import * as Scrivito from "scrivito";
import React, { useState, useEffect, useCallback } from "react";
import { isEmpty } from "lodash-es";

import getUserData from "../api/getUserData";
import TicketingApi from "../api/TicketingApi";
import i18n from "../config/i18n";
import addI18nBundles from "../config/addI18nBundles";
import { Keyable } from "../utils/types";
import ws from "../utils/ws";

const TenantContext = React.createContext({} as Keyable);

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

export function TenantContextProvider({ children }) {
  const [instance, setInstance] = React.useState<Keyable>();
  const [customAttributes, setCustomAttributes] = React.useState<Keyable>();
  const [ticketSchema, setTicketSchema] = useState<Keyable>();
  const [ticketUiSchema, setTicketUiSchema] = useState<Keyable>();

  const [userData, setUserData] = useState<Keyable>();
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Keyable | null>(null);

  useEffect(() => {
    loadUserInfo();
    loadConfiguration();
    loadTicketFormConfiguration();
  }, []);

  useEffect(() => {
    if (!ticketUiSchema || !customAttributes) {
      return;
    }

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
      addError("Error load ticket schema", "TenantContextProvider", error);
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
  };

  const loadConfiguration = async () => {
    const instance = await TicketingApi.get("instance");

    setInstance(instance);
    setCustomAttributes(instance.custom_attributes);
    addI18nBundles(instance.locales);

    ws.init(instance.id);
  };

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
  };

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
      addError("Error load user info", "TenantContextProvider", error);
    }
  };

  function isTenantContextReady() {
    return !isEmpty(ticketSchema) && !isEmpty(ticketUiSchema) && userId;
  }

  const updateLanguage = useCallback((language) => {
    i18n.changeLanguage(language);
  }, []);

  const removeError = () => setError(null);

  const addError = useCallback((message, location, error) => {
    console.error(location, message, error);
    setError({ message, location, error });
  }, []);

  return (
    <TenantContext.Provider
      value={{
        instance,
        customAttributes,
        ticketSchema,
        ticketUiSchema,
        isTenantContextReady,
        userData,
        userId,
        updateLanguage,
        error,
        addError,
        removeError,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  return React.useContext(TenantContext);
}
