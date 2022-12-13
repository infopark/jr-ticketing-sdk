import React from "react";
import classNames from "classnames";
import { uniqueId } from "lodash-es";

import i18n from "../../../config/i18n";
import { activityTypes, typesDictionary } from "./ActivityTypeUtils";

const ActivityFilters = ({ filters, handleFilterClick }) => (
  <>
    <span className="mr-3">{i18n.t("show only")}</span>
    {activityTypes.map((type) => {
      const { name, icon } = typesDictionary[type];
      return (
        <button
          className={classNames("btn btn-sm btn-rounded mr-1 mb-1", {
            "btn-dark": filters.includes(type),
          })}
          onClick={() => handleFilterClick(type)}
          key={uniqueId()}
        >
          <i className={`fa opacity_5 mr-2 fa-${icon}`} />
          {i18n.t(name)}
        </button>
      );
    })}
  </>
);

export default ActivityFilters;
