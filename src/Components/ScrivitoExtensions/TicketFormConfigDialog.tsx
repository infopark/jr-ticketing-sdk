import * as React from "react";
import * as Scrivito from "scrivito";
import i18n from "../../config/i18n";
import { TenantContextProvider, useTenantContext } from "../TenantContextProvider";
import { SortableContainer } from "./SortableContainer";

function transformPropertiesToArray(input, uiSchema) {
  const fieldList = Object.keys(input).map((key) => ({
    ...input[key],
    name: key,
    showCreate: uiSchema[key] ? uiSchema[key]["ui:widget"] !== "hidden" : true,
    showDetails: uiSchema[key] ? uiSchema[key]["ui:details"] !== "hidden" : true,
  }));
  if (uiSchema["ui:order"]) {
    const sortArray = uiSchema["ui:order"].filter((item) => item !== "*");
    return fieldList.sort((a, b) =>
      sortArray.findIndex((name) => name === a.name) >
      sortArray.findIndex((name) => name === b.name)
        ? 1
        : -1
    );
  }
  return fieldList;
}

function fromPropertiesDefinitionToSchema(inputList) {
  const uiSchema = {};
  const formData = {};
  inputList.forEach((item) => {
    const { name, showCreate, showDetails } = item;
    if (!showCreate) {
      uiSchema[name] = { "ui:widget": "hidden" };
    }
    if (!showDetails) {
      uiSchema[name] = { "ui:details": "hidden" };
    }
  });
  uiSchema["ui:order"] = [...inputList.map((item) => item.name), "*"];
  return {
    uiSchema,
    formSchema: { formData },
  };
}

const TicketFormConfigDialog = Scrivito.connect(() => (
  <TenantContextProvider>
    <TicketFormConfigDialogContent />
  </TenantContextProvider>
));

const TicketFormConfigDialogContent = Scrivito.connect(() => {
  const [orderedObjs, setOrderedObjs] = React.useState<Array<any>>([]);
  const { ticketSchema, ticketFormConfiguration } = useTenantContext();
  React.useEffect(() => {
    if (ticketSchema && ticketFormConfiguration) {
      setOrderedObjs(
        transformPropertiesToArray(ticketSchema.properties, ticketFormConfiguration.uiSchema)
      );
    }
  }, [ticketSchema, ticketFormConfiguration]);

  const updateField = (field, changes) => {
    const newObjs = orderedObjs.map((item: any) =>
      item.name === field.name ? { ...item, ...changes } : item
    );
    updateSchema(newObjs);
  };

  const onSortEnd = (nextOrder, _oldIndex, _newIndex) => {
    updateSchema(nextOrder);
  };

  const updateSchema = (orderedItems) => {
    setOrderedObjs(orderedItems);
    const { formSchema, uiSchema } =
      fromPropertiesDefinitionToSchema(orderedItems);
    Scrivito.load(() => {
      const [obj] = Scrivito.Obj.onAllSites()
        .where("_objClass", "equals", "TicketFormConfiguration")
        .take(1);
      return obj;
    }).then((obj) => {
      if (obj) {
        obj.update({
          formSchema: JSON.stringify(formSchema),
          uiSchema: JSON.stringify(uiSchema),
        });
      } else {
        (Scrivito.getClass("TicketFormConfiguration") as any).onAllSites().create({
          formSchema: JSON.stringify(formSchema),
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
        ids={objs.map((obj) => obj.name)}
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
