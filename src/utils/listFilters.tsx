import { filter as lFilter, map, uniq, each } from "lodash";
import { capitalize } from "lodash-es";
import { dictTranslate } from "./translate";

const staticTicketListFilters = {
  all: {
    filter(data) {
      return data;
    },
    label: "all",
  },
  active: undefined as any,
};

const createTicketsListFilters = (
  tickets,
  statusDictionary,
  isTicketStatusClosed
) => {
  const filterKeys = uniq(map(tickets, (obj) => obj.status));
  const ticketsListFilters = { ...staticTicketListFilters };
  ticketsListFilters.active =
    createDefaultTicketListFilter(isTicketStatusClosed);
  each(filterKeys, (filterKey) => {
    const localizedFilterKey = capitalize(
      dictTranslate(filterKey, statusDictionary)
    );
    ticketsListFilters[localizedFilterKey] = {
      filter(data) {
        return lFilter(
          data,
          (obj) =>
            capitalize(dictTranslate(obj.status, statusDictionary)) ===
            localizedFilterKey
        );
      },
      label: localizedFilterKey,
    };
  });
  return ticketsListFilters;
};

const createDefaultTicketListFilter = (isTicketStatusClosed) => ({
  filter(data) {
    return lFilter(
      data,
      (obj) => !isTicketStatusClosed(obj.tickettype, obj.status)
    );
  },
  label: "active",
});

const isTicketListFilterDisabled = (
  ticketsListFilters,
  tickets,
  isTicketStatusClosed
) => {
  if (
    Object.keys(ticketsListFilters).length >
    Object.keys(staticTicketListFilters).length + 1
  ) {
    return false;
  }
  for (const ticket of tickets) {
    if (isTicketStatusClosed(ticket.tickettype, ticket.status)) {
      return false;
    }
  }
  return true;
};

export {
  createTicketsListFilters,
  createDefaultTicketListFilter,
  isTicketListFilterDisabled,
};
