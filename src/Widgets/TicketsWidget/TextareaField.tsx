import React, { useState } from "react";
import classNames from "classnames";
import { translate } from "../../utils/translate";

function TextareaField({ fieldName, fieldConfig, onChange }) {
  const { labelName, placeholder, hint, validations, disabled, tooltip } =
    fieldConfig;
  const [textareaHeight, setTextareaHeight] = useState(140);
  const [invalid, setInvalid] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const handleKeys = (e) => {
    if (e.keyCode !== 13 && e.keyCode !== 8) {
      return;
    }
    const message = e.target && e.target.value;
    if (!message) {
      return;
    }
    const numberOfLineBreaks = (message.match(/\n/g) || []).length;
    if (numberOfLineBreaks < 4 || numberOfLineBreaks > 20) {
      return;
    }
    const newHeight = (numberOfLineBreaks + 1) * 26 + 20;
    setTextareaHeight(newHeight);
  };

  const validate = (e) => {
    validations && validations.map((validation) => {
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
      <div
        className={`form-control-wrapper${tooltip ? " tooltip-container" : ""}`}
      >
        <textarea
          name={fieldName}
          placeholder={translate(placeholder)}
          className={classNames("form-control dialog_text_area resize-ta", {
            "is-invalid": invalid,
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
          onKeyUp={handleKeys}
          style={{ height: textareaHeight }}
          disabled={disabled}
        />
        {hint && !invalid && <small>{translate(hint)}</small>}
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
    </dl>
  );
}

export default TextareaField;
