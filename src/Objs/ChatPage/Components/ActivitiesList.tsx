import React, { useState, useEffect } from "react";
import { pull } from "lodash-es";
import ActivityBox from "./ActivityBox";
import ActivityFilters from "./ActivityFilters";
import PageContentWrapper from "./PageContentWrapper";
import InnerPageContentWrapper from "./InnerPageContentWrapper";

const ActivitiesList = ({ activities }) => {
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filters, setFilters] = useState([] as any[]);

  const handleFilterClick = (type) => {
    if (filters.includes(type)) {
      const pulled = pull(filters, type);
      setFilters([...pulled]);
    } else {
      setFilters([...filters, type]);
    }
  };

  useEffect(() => {
    const filterBy = (types) => {
      const filtered = activities.filter((activity) =>
        types.includes(activity["PSA_ACT_XRO.STY_TYP_IDN"])
      );
      return filtered;
    };
    setFilteredActivities(filterBy(filters));
  }, [filters, activities]);

  const activitiesToShow = filteredActivities.length
    ? filteredActivities
    : activities;

  return (
    <PageContentWrapper>
      <InnerPageContentWrapper additionalBoxClass="min_hight_box">
        <div className="box d-flex flex-wrap mb-2 align-items-center">
          <ActivityFilters
            filters={filters}
            handleFilterClick={handleFilterClick}
          />
        </div>
        {activitiesToShow.map((act, i) => (
          <div className="box" key={i}>
            <ActivityBox activity={act} />
          </div>
        ))}
      </InnerPageContentWrapper>
    </PageContentWrapper>
  );
};
export default ActivitiesList;
