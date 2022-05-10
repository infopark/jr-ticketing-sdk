import React, { useState } from "react";
import classNames from "classnames";

import { parseDate } from "../../../utils/dateUtils";
import { translate } from "../../../utils/translate";
import { useUserData } from "../../../Components/UserDataContext";
import { matchIconToType as matchType } from "./ActivityTypeUtils";

const ActivityBox = ({ activity }) => {
  const { userData } = useUserData();
  const [showDetails, setShowDetails] = useState(false);

  function toggleDetails() {
    setShowDetails(!showDetails);
  }

  return (
    <div className="mb-3 ticket_attachment">
      <div className="d-flex">
        <i
          className={`mr-3 mt-1 opacity_5 fz_2 fa fa-${matchType(
            activity["PSA_ACT_XRO.STY_TYP_IDN"]
          )}`}
        />
        <div className="flex-grow-2">
          <h2 className="reset_mb">
            {activity["PSA_ACT_XRO.NAM"].replace("### ", "")}
          </h2>
          <small className="d-block mb-2">
            <span className="mr-3 semi_bold color_captured">
              {translate(activity["PSA_ACT_XRO.STA_NAM_ENG"])}
            </span>
            <span className="mr-3">|</span>
            <span className="color-gray mr-3">
              {translate("start date")}
              {": "}
              {parseDate(
                activity["PSA_ACT_XRO.BEG_DAT"],
                undefined,
                userData?.timelocale
              )}{" "}
            </span>
            <span className="mr-3">|</span>
            <span className="color-faded mr-1">
              {translate("end date")}
              {": "}
              {parseDate(
                activity["PSA_ACT_XRO.END_DAT"],
                undefined,
                userData?.timelocale
              )}{" "}
            </span>
          </small>
          {translate("responsible")}
          {": "}
          {activity["PSA_ACT_XRO.PSA_AGN_PRS.FRN_IDN"]} <br />
          {translate("client")}
          {": "}
          {activity["PSA_ACT_XRO.PSA_CLI_CON.FRN_IDN"]}
        </div>
        <div>
          <button
            className="btn btn-secondary btn-sm ticket_attachment_btn"
            onClick={() => toggleDetails()}
          >
            <i
              className={classNames("fa animate fa-chevron-down mr-2", {
                "icon-rotated": showDetails,
              })}
            />
            {translate("details")}
          </button>
        </div>
      </div>
      {showDetails && (
        <div
          className="box bg_white mt-3 scroll-box-300"
          dangerouslySetInnerHTML={{ __html: activity["PSA_ACT_XRO.CTT"] }}
        ></div>
      )}
    </div>
  );
};

export default ActivityBox;
