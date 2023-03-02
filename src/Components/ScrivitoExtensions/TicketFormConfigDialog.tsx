import * as React from "react";
import * as Scrivito from "scrivito";

import i18n from "../../config/i18n";
import { Keyable } from "../../utils/types";
import { TenantContextProvider, useTenantContext } from "../TenantContextProvider";
import { SortableContainer } from "./SortableContainer";

function transformPropertiesToArray(input: Keyable, uiSchema: Keyable) {
  const fieldList = Object.entries(input).map(([key, schema]: [string, Keyable]) => ({
    ...schema,
    name: key,
    showCreate: schema["ui:regular"] || (uiSchema[key] ? uiSchema[key]["ui:widget"] !== "hidden" : false),
    showDetails: schema["ui:regular"] || (uiSchema[key] ? uiSchema[key]["ui:details"] !== "hidden" : false),
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
    const { name, showCreate, showDetails } = item;
    uiSchema[name] = {};
    if (!showCreate) {
      uiSchema[name]["ui:widget"] = "hidden";
    }
    if (!showDetails) {
      uiSchema[name]["ui:details"] = "hidden";
    }
  });
  uiSchema["ui:order"] = inputList.map((item) => item.name);
  return {
    uiSchema,
  };
}

const TicketFormConfigDialog = Scrivito.connect(() => (
  <TenantContextProvider>
    <TicketFormConfigDialogContent />
  </TenantContextProvider>
));

const TicketFormConfigDialogContent = Scrivito.connect(() => {
  const [orderedObjs, setOrderedObjs] = React.useState<Keyable[]>([]);
  const { ticketSchema, ticketUiSchema, customAttributes } = useTenantContext();
  React.useEffect(() => {
    if (ticketSchema && ticketUiSchema) {
      setOrderedObjs(
        transformPropertiesToArray({ ...ticketSchema.properties, ...customAttributes.Ticket }, ticketUiSchema)
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
    Scrivito.load(() => {
      const [obj] = Scrivito.Obj.onAllSites()
        .where("_objClass", "equals", "TicketFormConfiguration")
        .take(1);
      return obj;
    }).then((obj) => {
      if (obj) {
        obj.update({
          uiSchema: JSON.stringify(uiSchema),
        });
      } else {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (Scrivito.getClass("TicketFormConfiguration") as any).onAllSites().create({
          uiSchema: JSON.stringify(uiSchema),
        });
      }
    });
  };

  return (
    <div
      className="scrivito_modal_large scrivito_show"
      style={{ padding: 0, boxShadow: "none" }}
    >
      <div className="scrivito_modal_body">
        <SortableObjList
          objs={orderedObjs}
          onSortEnd={onSortEnd}
          updateField={updateField}
        />
      </div>
    </div>
  );

});

function SortableObjList({
  objs,
  onSortEnd,
  updateField,
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
          />
        ))}
      </SortableContainer>
    </div>
  );
}

const SortableObjListItem = ({ obj, updateField }) => {
  return (
    <li>
      <div>
        {i18n.t("TicketFormConfigDialog.fieldname")}
        {" "}
        {obj.title || obj.name}
      </div>
      {!obj["ui:regular"] && (
        <>
          <div>
            <label>
              <input
                type="checkbox"
                name="showCreate"
                checked={obj.showCreate}
                onChange={(_event) => {
                  updateField(obj, { showCreate: !obj.showCreate });
                }}
              />
              {" "}
              {i18n.t("TicketFormConfigDialog.showInCreateForm")}
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="showDetails"
                checked={obj.showDetails}
                onChange={(_event) => {
                  updateField(obj, { showDetails: !obj.showDetails });
                }}
              />
              {" "}
              {i18n.t("TicketFormConfigDialog.showInDetails")}
            </label>
          </div>
        </>
      )}
    </li>
  );
};

Scrivito.registerComponent("TicketFormConfigDialog", TicketFormConfigDialog);
