import * as React from "react";
import * as Scrivito from "scrivito";
import { translate } from "../../utils/translate";
import { ticketsListSorters } from "../../utils/listSorters";

function TicketListBoxHeader({
  widget,
  handleSort,
  active,
  sortKey,
  ticketsListFilters,
  filterKey,
  handleFilter,
  filterDisabled,
}) {
  const sortKeys = Object.keys(ticketsListSorters);
  const filterKeys = Object.keys(ticketsListFilters);
  return (
    <div className="row header_box">
      <div className="col-xl-12 space_box mb-2">
        <div className="flex_grid">
          <div className="pr-2 pb-2 white-space-no-wrap ticket-list-header">
            <Scrivito.ContentTag
              content={widget}
              tag="h3"
              attribute="headline"
            />
          </div>
          <div className="flex_auto mr-lg-2 mb-2 mb-lg-0 ticket-list-filter">
            <select
              className="form-control"
              onChange={(event) => handleSort(event)}
              disabled={!active}
              value={sortKey}
            >
              {sortKeys.map((item) => (
                <option value={item} key={`option_${item}_${widget.id()}`}>
                  {translate(item as any)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex_auto ticket-list-filter">
            <select
              className="form-control"
              onChange={(event) => handleFilter(event)}
              disabled={!active || filterDisabled}
              value={filterKey}
            >
              {filterKeys.map((item) => (
                <option value={item} key={`option_${item}_${widget.id()}`}>
                  {translate(item as any)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Scrivito.connect(TicketListBoxHeader);
