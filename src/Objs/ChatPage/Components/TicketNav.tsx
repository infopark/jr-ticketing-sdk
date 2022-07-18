import React, { useEffect } from "react";
import classNames from "classnames";
import { translate } from "../../../utils/translate";

const TicketNav = ({ toggleMode, mode, viewModes }) => {
  useEffect(() => {
    if (!viewModes[mode].clickable) {
      toggleMode("chat");
    }
  });

  return (
    <div className="sdk-chat-page">
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
                    {translate(viewModeObj.name)}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TicketNav;
