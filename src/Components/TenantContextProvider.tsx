import React from "react";

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

  const [currentUser, setCurrentUser] = React.useState<Keyable>();
  const [error, setError] = React.useState<Keyable | null>(null);

  React.useEffect(() => {
    loadUserInfo();
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const instance = await TicketingApi.get("instance");

      setInstance(instance);
      addI18nBundles(instance.locales);

      ws.init(instance.id);
    } catch (error) {
      addError("Error loading instance info", "TenantContextProvider", error);
    }
  };

  const loadUserInfo = async () => {
    try {
      const data = await getUserData();
      if (!data) {
        setCurrentUser(undefined);
        return;
      }

      if (!data) {
        setCurrentUser(undefined);
        return;
      }

      setCurrentUser(data);
    } catch (error) {
      addError("Error loading user info", "TenantContextProvider", error);
    }
  };

  const prepareTicketSchema = React.useCallback((ticketUiSchema: Keyable, instance: Keyable): Keyable | null => {
    if (!ticketUiSchema || !instance) {
      return null;
    }

    const properties = (() => {
      try {
        const customTicketProps = {};
        const order = ticketUiSchema["ui:order"] || [];
        Object.entries(instance.custom_attributes.Ticket || {}).forEach(([name, schema]) => {
          if (order.indexOf(name) >= 0) {
            customTicketProps[name] = schema;
          }
        });
        return { ...TicketAttributes, ...customTicketProps };
      } catch (error) {
        addError("Error load ticket schema", "TenantContextProvider", error);
        return { ...TicketAttributes };
      }
    })();

    Object.keys(properties).forEach((key) => {
      const prop = properties[key];

      prop.title = i18n.t(`Ticket.labels.${key}`);
      if (prop.enum) {
        prop.enumNames = prop.enum.map((value) => i18n.t(`Ticket.${key}.${value}`));
      }
    });

    return {
      type: "object",
      properties,
      required: Object.keys(properties).filter((name) => properties[name]["ui:required"]),
    };
  }, []);

  function isTenantContextReady() {
    return !!(instance && currentUser?.id);
  }

  const updateLanguage = React.useCallback((language: string) => {
    i18n.changeLanguage(language);
  }, []);

  const removeError = () => setError(null);

  const addError = React.useCallback((message: string, location: string, error: unknown) => {
    console.error(location, message, error);
    setError({ message, location, error });
  }, []);

  return (
    <TenantContext.Provider
      value={{
        instance,
        prepareTicketSchema,
        isTenantContextReady,
        currentUser,
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

type TTenantContext = {
  instance: Keyable;
  prepareTicketSchema: (ticketUiSchema: Keyable, instance: Keyable) => Keyable | null;
  isTenantContextReady: () => boolean;
  currentUser: Keyable;
  updateLanguage: (language: string) => void;
  error: Keyable | null;
  addError: (message: string, location: string, error: unknown) => void;
  removeError: () => void;
};

export function useTenantContext(): TTenantContext {
  return React.useContext(TenantContext) as TTenantContext;
}
