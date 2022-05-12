import React from "react";
import { translate } from "../../utils/translate";
import { find } from "lodash";

function EditUserDataRow({
  user,
  fieldName,
  label,
  onInputChange,
  editable,
  options,
  type,
}) {
  const defaultOption = find(
    options,
    (option) => option.value === user[fieldName]
  );
  const defaultValue = defaultOption
    ? translate(defaultOption.name)
    : user[fieldName];
  return (
    <dl className="d-flex flex-wrap table_style">
      <dt className="regular item_label">{label}</dt>
      {options && type === "select" && (
        <select
          className="form-control"
          name={fieldName}
          onChange={(e) => onInputChange(e)}
          defaultValue={defaultOption ? defaultOption.value : undefined}
          disabled={!editable}
        >
          {options.map((option, counter) => (
            <option value={option.value} key={`option_${counter}`}>
              {translate(option.name)}
            </option>
          ))}
        </select>
      )}
      {options &&
        type === "radio" &&
        options.map((option, counter) => (
          <span key={`option_${counter}`} className="d-inline-block mr-3">
            <input
              onChange={(e) => onInputChange(e)}
              type="radio"
              id={option.value}
              name={fieldName}
              className="d-none"
              value={option.value}
              defaultChecked={
                user[fieldName]
                  ? user[fieldName] === option.value
                  : counter === 0
              }
              disabled={!editable}
            />
            <label
              htmlFor={option.value}
              className={`btn${!editable ? " disabled" : ""}`}
            >
              <i className="fa mr-2" />
              {translate(option.name)}
            </label>
          </span>
        ))}
      {!type && (
        <input
          className="form-control"
          type="text"
          defaultValue={defaultValue}
          name={fieldName}
          onChange={(e) => onInputChange(e)}
          disabled={!editable}
        />
      )}
    </dl>
  );
}

export default EditUserDataRow;
