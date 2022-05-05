import * as React from "react";
import { translate } from "../../utils/translate";

function FooterButtons({ handleCancelClick, disabled }) {
  return (
    <footer id="overlay_footer" className="btn_control">
      <button
        type="button"
        className="btn btn-secondary float_left"
        onClick={(event) => {
          handleCancelClick(event);
        }}
      >
        {translate("cancel")}
      </button>
      <button
        type="submit"
        className="btn btn-primary float_right"
        disabled={disabled}
      >
        {translate("Create")}
      </button>
    </footer>
  );
}
export default FooterButtons;
