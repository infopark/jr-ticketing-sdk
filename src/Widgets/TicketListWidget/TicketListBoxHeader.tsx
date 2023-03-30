import React from "react";

import i18n from "../../config/i18n";

function TicketListBoxHeader({
  active,
  ticketFilters,
  filterKey,
  handleFilter,
  count,
  total
}) {
  const filterKeys = Object.keys(ticketFilters);

  return (
    <div className="row ticket_list">
      <div className="col-xl-12">
        <div className="box box_bg_white">
          <div className="d-md-flex align-items-center justify-content-between">
            <div className="d-md-flex align-items-center mb-3 mb-md-0">
              <span className="d-inline-flex me-2">{i18n.t("TicketListWidget.title")}</span>
              <span className="d-inline-flex">
                <i>{i18n.t("TicketListWidget.header", { count, total })}</i>
              </span>
            </div>
            <form>
              <div className="input-group">
                <label className="input-group-text filter-input" htmlFor="filter">
                  <i className="fa-solid fa-filter" />
                </label>

                <select
                  className="form-select"
                  onChange={(event) => handleFilter(event)}
                  disabled={!active}
                  value={filterKey}
                  aria-label="filter"
                >
                  {filterKeys.map((name) => (
                    <option value={name} key={name}>
                      {i18n.t(`TicketListWidget.filters.${name}`)}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketListBoxHeader;
