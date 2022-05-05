import React, { useState } from "react";
import classNames from "classnames";
import { translate } from "../../utils/translate";

function InputField({
  fieldName,
  fieldConfig,
  onChange,
  loading,
  ...htmlAttrs
}) {
  const {
    tag,
    type,
    labelName,
    placeholder,
    selectOptions,
    validations,
    hint,
    disabled,
    tooltip,
  } = fieldConfig;
  const [invalid, setInvalid] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const isUploadField = type === "file";

  const validate = (e) => {
    validations?.map((validation) => {
      if (validation.validator(e, validation.constraint)) {
        setInvalid(true);
        setValidationMessages(
          validationMessages.includes(validation.message)
            ? [...validationMessages]
            : [...validationMessages, validation.message]
        );
      }
      return null;
    });
  };

  return (
    <dl className="d-flex flex-wrap table_style">
      <dt className="regular item_label">{translate(labelName)}</dt>
      {tag === "input" && (
        <div
          className={`form-control-wrapper${
            tooltip ? " tooltip-container" : ""
          }`}
        >
          <input
            type={type}
            name={fieldName}
            placeholder={translate(placeholder)}
            className={classNames("form-control", {
              "is-invalid": invalid,
              "file-loading": isUploadField && loading,
            })}
            onChange={(e) => {
              onChange(e);
              setInvalid(false);
              setValidationMessages([]);
              validate(e);
            }}
            onBlur={(e) => {
              validate(e);
            }}
            disabled={disabled}
            {...htmlAttrs}
          />
          {hint && !invalid && !loading && <small>{translate(hint)}</small>}
          {isUploadField && loading && !invalid && (
            <small>{translate("Processing file…")}</small>
          )}
          {invalid &&
            validationMessages.map((msg) => (
              <div className="invalid-feedback" key={msg}>
                {translate(msg as any)}
              </div>
            ))}
          {tooltip ? (
            <div
              className="tooltip"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-title={translate(tooltip)}
            >
              <span
                className={`fa fa-info-circle brand_color tooltip-icon${
                  disabled ? " disabled" : ""
                }`}
              ></span>
            </div>
          ) : null}
        </div>
      )}
      {tag === "select" && (
        <div
          className={`form-control-wrapper${
            tooltip ? " tooltip-container" : ""
          }`}
        >
          <select
            className="form-control"
            name={fieldName}
            onChange={(e) => onChange(e)}
            disabled={disabled}
          >
            {selectOptions.map((option, counter) => (
              <option value={option.value} key={`option_${counter}`}>
                {option.name}
              </option>
            ))}
          </select>
          {tooltip ? (
            <div
              className="tooltip"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-title={translate(tooltip)}
            >
              <span
                className={`fa fa-info-circle brand_color tooltip-icon${
                  disabled ? " disabled" : ""
                }`}
              ></span>
            </div>
          ) : null}
        </div>
      )}
      {tag === "radio" && (
        <div
          className={`form-control-wrapper${
            tooltip ? " tooltip-container" : ""
          }`}
        >
          {selectOptions.map((option, counter) => (
            <React.Fragment key={`option_${counter}`}>
              <input
                onChange={(e) => onChange(e)}
                type="radio"
                id={option.value}
                name={fieldName}
                className="d-none"
                value={option.value}
                defaultChecked={counter === 0}
                disabled={disabled}
              />
              <label
                htmlFor={option.value}
                className={`btn${disabled ? " disabled" : ""}`}
              >
                <i className="fa mr-2" />
                {option.name}
              </label>
            </React.Fragment>
          ))}
          {tooltip ? (
            <div
              className="tooltip"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-title={translate(tooltip)}
            >
              <span className="fa fa-info-circle brand_color tooltip-icon"></span>
            </div>
          ) : null}
        </div>
      )}
    </dl>
  );
}
export default InputField;
