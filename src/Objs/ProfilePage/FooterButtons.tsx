import React from "react";
import { translate } from "../../utils/translate";

function FooterButtons({ handleCancelEditClick, disabled }) {
  return (
    <footer id="overlay_footer">
      <button
        type="button"
        className="btn btn-secondary float_left"
        onClick={handleCancelEditClick}
      >
        {translate("cancel")}
      </button>
      <button
        type="submit"
        className="btn btn-primary float_right"
        disabled={disabled}
      >
        {translate("save")}
      </button>
    </footer>
  );
}

export default FooterButtons;
