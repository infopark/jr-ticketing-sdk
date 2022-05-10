import React from "react";
import classNames from "classnames";
import { uniqueId } from "lodash-es";
import { translate } from "../../../utils/translate";
import { activityTypes, typesDictionary } from "./ActivityTypeUtils";

const ActivityFilters = ({ filters, handleFilterClick }) => (
  <>
    <span className="mr-3">{translate("show only")}</span>
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
          {translate(name)}
        </button>
      );
    })}
  </>
);

export default ActivityFilters;
