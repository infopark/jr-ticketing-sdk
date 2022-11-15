import * as React from "react";
import { translate } from "../../utils/translate";

function FooterButtons({ disabled, onSubmit, onCancel }) {
  return (
    <footer id="overlay_footer" className="btn_control">
      <button
        type="button"
        className="btn btn-secondary float_left"
        onClick={onCancel}
      >
        {translate("cancel")}
      </button>
      <button
        type="submit"
        className="btn btn-primary float_right"
        disabled={disabled}
        onClick={onSubmit}
      >
        {translate("Create")}
      </button>
    </footer>
  );
}
export default FooterButtons;
