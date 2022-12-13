import * as React from "react";

import i18n from "../../config/i18n";

function FooterButtons({ disabled, onSubmit, onCancel }) {
  return (
    <footer id="overlay_footer" className="btn_control">
      <button
        type="button"
        className="btn btn-secondary float_left"
        onClick={onCancel}
      >
        {i18n.t("cancel")}
      </button>
      <button
        type="submit"
        className="btn btn-primary float_right"
        disabled={disabled}
        onClick={onSubmit}
      >
        {i18n.t("Create")}
      </button>
    </footer>
  );
}
export default FooterButtons;
