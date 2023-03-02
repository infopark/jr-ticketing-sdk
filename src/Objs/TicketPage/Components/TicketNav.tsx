import React, { useEffect } from "react";
import classNames from "classnames";

import i18n from "../../../config/i18n";

const TicketNav = ({ toggleMode, mode, viewModes }) => {
  useEffect(() => {
    if (!viewModes[mode].clickable) {
      toggleMode("chat");
    }
  });

  return (
    <header className="nav_header">
      <div className="row">
        <div className="col-lg-12 content_padding">
          <ul>
            {Object.keys(viewModes).map((viewMode) => {
              const viewModeObj = viewModes[viewMode];
              return (
                <li
                  className={classNames({
                    active: mode === viewModeObj.name,
                    "d-none": !viewModeObj.clickable,
                  })}
                  onClick={() => {
                    if (viewModeObj.clickable) {
                      toggleMode(viewModeObj.name);
                    }
                  }}
                  key={viewModeObj.name}
                >
                  {i18n.t(viewModeObj.name)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default TicketNav;
