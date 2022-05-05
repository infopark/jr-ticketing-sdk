declare const createTicketsListFilters: (tickets: any, statusDictionary: any, isTicketStatusClosed: any) => {
    all: {
        filter(data: any): any;
        label: string;
    };
    active: any;
};
declare const createDefaultTicketListFilter: (isTicketStatusClosed: any) => {
    filter(data: any): any;
    label: string;
};
declare const isTicketListFilterDisabled: (ticketsListFilters: any, tickets: any, isTicketStatusClosed: any) => boolean;
export { createTicketsListFilters, createDefaultTicketListFilter, isTicketListFilterDisabled, };
