import React from "react";
import * as Scrivito from "scrivito";

import i18n from "../config/i18n";
import { Keyable } from "../utils/types";
import { TenantContextProvider, useTenantContext } from "./TenantContextProvider";
import { SortableContainer } from "./SortableContainer";

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

enum TicketFormConfigDialogMode {
  CREATE = "create",
  DETAILS = "details"
}

const TicketFormConfigDialog = ({ object, mode }: { object: Scrivito.Obj, mode: TicketFormConfigDialogMode }) => (
  <TenantContextProvider>
    <TicketFormConfigDialogContent object={object} mode={mode} />
  </TenantContextProvider>
);

const TicketFormConfigDialogContent = ({ object, mode }: { object: Scrivito.Obj, mode: TicketFormConfigDialogMode }) => {
  const [orderedObjs, setOrderedObjs] = React.useState<Keyable[]>([]);
  const { prepareTicketSchema, instance } = useTenantContext();
  const [ticketSchema, setTicketSchema] = React.useState<Keyable | null>();
  const [ticketUiSchema, setTicketUiSchema] = React.useState<Keyable>();

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
    <div className="scrivito_modal_large scrivito_show p-0 shadow-none">
      <div className="scrivito_modal_body">
        <SortableObjList
          objs={orderedObjs}
          onSortEnd={onSortEnd}
          updateField={updateField}
          mode={mode}
        />
      </div>
    </div>
  );
};

function SortableObjList({
  objs,
  onSortEnd,
  updateField,
  mode,
}) {
  return (
    <div id="scrivito_obj_sorting_sortable">
      <SortableContainer
        ids={objs.map((obj: Keyable) => obj.name)}
        items={objs}
        onSortEnd={onSortEnd}
        disabled={false}
        useDragHandle={null}
      >
        {objs.map((obj) => (
          <SortableObjListItem
            key={obj.name}
            obj={obj}
            updateField={updateField}
            mode={mode}
          />
        ))}
      </SortableContainer>
    </div>
  );
}

const SortableObjListItem = ({ obj, updateField, mode }) => {
  return (
    <li>
      <div>
        {i18n.t("TicketFormConfigDialog.fieldname")}
        {" "}
        {obj.title || obj.name}
      </div>
      {!obj["ui:regular"] && (
        <div>
          <label>
            <input
              type="checkbox"
              name="show"
              checked={obj.show}
              onChange={(_event) => {
                updateField(obj, { show: !obj.show });
              }}
            />
            {" "}
            {mode === TicketFormConfigDialogMode.CREATE && i18n.t("TicketFormConfigDialog.showInCreateForm")}
            {mode === TicketFormConfigDialogMode.DETAILS && i18n.t("TicketFormConfigDialog.showInDetails")}
          </label>
        </div>
      )}
    </li>
  );
};

export { TicketFormConfigDialog, TicketFormConfigDialogMode };
