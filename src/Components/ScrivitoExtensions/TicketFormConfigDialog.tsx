import * as React from "react";
import * as Scrivito from "scrivito";
import I18n from "../../config/i18n";
import { TenantContextProvider, useTenantContext } from "../TenantContextProvider";
import { SortableContainer } from "./SortableContainer";

function transformPropertiesToArray(input, uiSchema) {
  const fieldList = Object.keys(input).map((key) => ({
    ...input[key],
    name: key,
    visibility: uiSchema[key] ? uiSchema[key]["ui:widget"] !== "hidden" : true,
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
    const { name, visibility } = item;
    if (!visibility) {
      uiSchema[name] = { "ui:widget": "hidden" };
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
  // const [schema, setSchema] = React.useState({});
  const { ticketSchema } = useTenantContext();
  React.useEffect(() => {
    if (!ticketSchema) {
      return;
    }

    Scrivito.load(() => {
      const [obj] = Scrivito.Obj.onAllSites()
        .where("_objClass", "equals", "TicketFormConfiguration")
        .take(1);
      return obj;
    }).then((obj) => {
      const localUiSchema = JSON.parse(obj?.get("uiSchema") as string || "{}");
      setOrderedObjs(
        transformPropertiesToArray(ticketSchema.properties, localUiSchema)
      );
    });
  }, [ticketSchema]);

  const updateVisibility = (_event, obj) => {
    const newObjs = orderedObjs.map((item: any) =>
      item.name === obj.name ? { ...item, visibility: !item.visibility } : item
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
          updateVisibility={updateVisibility}
        />
      </div>
    </div>
  );

});

function SortableObjList({
  objs,
  onSortEnd,
  updateVisibility,
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
            updateVisibility={updateVisibility}
          />
        ))}
      </SortableContainer>
    </div>
  );
}

const SortableObjListItem = ({ obj, updateVisibility }) => {
  return (
    <li>
      <div>
        {I18n.t("TicketFormConfigDialog.fieldname")}
        {" "}
        {obj.title || obj.name}
      </div>
      {!obj["ui:regular"] && (
        <div>
          <label>
            {I18n.t("TicketFormConfigDialog.isVisible")}
            {" "}
            <input
              type="checkbox"
              name="visibility"
              checked={obj.visibility}
              onChange={(e) => {
                updateVisibility(e, obj);
              }}
            />
          </label>
        </div>
      )}
    </li>
  );
};

Scrivito.registerComponent("TicketFormConfigDialog", TicketFormConfigDialog);
