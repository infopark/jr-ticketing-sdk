import React from "react";

import i18n from "../../config/i18n";
import { Keyable } from "../../utils/types";
import { SortableContainer } from "./SortableContainer";

function SortableObjList({
  objs,
  onSortEnd,
  updateField,
  disabled,
}) {
  return (
    <div id="scrivito_obj_sorting_sortable">
      <SortableContainer
        ids={objs.map((obj: Keyable) => obj.name)}
        items={objs}
        onSortEnd={onSortEnd}
        disabled={disabled}
        useDragHandle={null}
      >
        {objs.map((obj) => (
          <SortableObjListItem
            key={obj.name}
            obj={obj}
            updateField={updateField}
            disabled={disabled}
          />
        ))}
      </SortableContainer>
    </div>
  );
}

const SortableObjListItem = ({ obj, updateField, disabled }) => {
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
              disabled={disabled}
              onChange={(_event) => {
                updateField(obj, { show: !obj.show });
              }}
            />
            {" "}
            {i18n.t("TicketFormConfigDialog.show")}
          </label>
        </div>
      )}
    </li>
  );
};

export { SortableObjList };
