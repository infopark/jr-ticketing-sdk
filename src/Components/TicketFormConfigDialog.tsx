import React from "react";
import * as Scrivito from "scrivito";

import { Keyable } from "../utils/types";
import { TicketingContextProvider, useTicketingContext } from "./TicketingContextProvider";
import { SortableObjList } from "./TicketFormConfigDialog/SortableObjList";

export const TicketFormConfigDialog = ({ object }: { object: Scrivito.Obj }) => (
  <TicketingContextProvider history={null}>
    <TicketFormConfigDialogContent object={object} />
  </TicketingContextProvider>
);

const TicketFormConfigDialogContent = Scrivito.connect(({ object }: { object: Scrivito.Obj }) => {
  const [orderedObjs, setOrderedObjs] = React.useState<Keyable[]>([]);
  const { prepareTicketSchema, instance } = useTicketingContext();
  const [ticketSchema, setTicketSchema] = React.useState<Keyable | null>();
  const [ticketUiSchema, setTicketUiSchema] = React.useState<Keyable>();
  const disabled = !Scrivito.canWrite();

  React.useEffect(() => {
    setTicketUiSchema(
      JSON.parse(object.get("uiSchema") as string || "{}")
    );
  }, []);

  React.useEffect(() => {
    setTicketSchema(
      prepareTicketSchema(ticketUiSchema as Keyable, instance)
    );
  }, [ticketUiSchema, instance]);

  React.useEffect(() => {
    if (ticketSchema && ticketUiSchema) {
      setOrderedObjs(
        transformPropertiesToArray({ ...ticketSchema.properties, ...instance.custom_attributes.Ticket }, ticketUiSchema)
      );
    }
  }, [ticketSchema, ticketUiSchema]);

  const updateField = (field: Keyable, changes: Keyable) => {
    const newObjs = orderedObjs.map((item: Keyable) =>
      item.name === field.name ? { ...item, ...changes } : item
    );
    updateSchema(newObjs);
  };

  const onSortEnd = (nextOrder: Keyable[], _oldIndex: unknown, _newIndex: unknown) => {
    updateSchema(nextOrder);
  };

  const updateSchema = (orderedItems: Keyable[]) => {
    setOrderedObjs(orderedItems);
    const { uiSchema } = fromPropertiesDefinitionToSchema(orderedItems);
    object.update({ uiSchema: JSON.stringify(uiSchema) });
  };

  return (
    <div className="scrivito_detail_content">
      <SortableObjList
        objs={orderedObjs}
        onSortEnd={onSortEnd}
        updateField={updateField}
        disabled={disabled}
      />
    </div>
  );
});

function transformPropertiesToArray(input: Keyable, uiSchema: Keyable) {
  const fieldList = Object.entries(input).map(([key, schema]: [string, Keyable]) => ({
    ...schema,
    name: key,
    show: schema["ui:regular"] || (uiSchema[key] ? uiSchema[key]["ui:widget"] !== "hidden" : false),
  }));
  if (uiSchema["ui:order"]) {
    const order = uiSchema["ui:order"];
    fieldList.sort((a, b) => {
      const indexA = 1 + order.indexOf(a.name) || 1 + Object.keys(input).indexOf(a.name);
      const indexB = 1 + order.indexOf(b.name) || 1 + Object.keys(input).indexOf(b.name);

      return indexA - indexB;
    });
  }
  return fieldList;
}

function fromPropertiesDefinitionToSchema(inputList: Keyable[]) {
  const uiSchema = {};
  inputList.forEach((item) => {
    const { name, show } = item;
    uiSchema[name] = {};
    if (!show) {
      uiSchema[name]["ui:widget"] = "hidden";
    }
  });
  uiSchema["ui:order"] = inputList.map((item) => item.name);
  return {
    uiSchema,
  };
}
