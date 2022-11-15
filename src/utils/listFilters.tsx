import { filter as lFilter, map, uniq, each } from "lodash";

import i18n from "../config/i18n";

const staticTicketListFilters = {
  all: {
    filter(data) {
      return data;
    },
    label: "all",
  },
  active: {
    filter(data) {
      return data.filter((obj) => obj.status !== "closed");
    },
    label: "active",
  },
};

const createTicketsListFilters = (
  tickets,
  statusDictionary,
  isTicketStatusClosed
) => {
  const filterKeys = uniq(map(tickets, (obj) => obj.status));
  const ticketsListFilters = { ...staticTicketListFilters };
  each(filterKeys, (filterKey) => {
    const localizedFilterKey = i18n.t(filterKey);
    ticketsListFilters[localizedFilterKey] = {
      filter(data) {
        return lFilter(
          data,
          (obj) => i18n.t(obj.status) === localizedFilterKey
        );
      },
      label: localizedFilterKey,
    };
  });
  return ticketsListFilters;
};

const createDefaultTicketListFilter = (isTicketStatusClosed) => {
  return staticTicketListFilters.active;
};

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
