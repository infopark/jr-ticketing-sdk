declare function isTicketStatusClosed(ticketType: string | undefined, ticketStatus: any): boolean;
declare function isTicketStatusOpen(ticketType: string | undefined, ticketStatus: any): boolean;
declare function getInitialTicketStatusOpen(ticketType?: string): any;
declare function getInitialTicketStatusClosed(ticketType?: string): any;
declare function isTenantContextReady(): boolean;
export declare function useTenantLocalization(): {
    tenantLocalization: {
        en: {
            PSA_SVC_TRB_CLS: string;
            PSA_SVC_TRB_DON: string;
            PSA_SVC_TRB_DCS: string;
            PSA_SVC_TRB_ACQ: string;
            PSA_SVC_TRB_DSP: string;
            PSA_SVC_CAL: string;
            PSA_SVC_CPL: string;
            PSA_SVC_SUP: string;
            PSA_SVC_TRB: string;
            PSA_SVC_TRB_LIT: string;
        };
    };
    isTicketStatusOpen: typeof isTicketStatusOpen;
    isTicketStatusClosed: typeof isTicketStatusClosed;
    getInitialTicketStatusOpen: typeof getInitialTicketStatusOpen;
    getInitialTicketStatusClosed: typeof getInitialTicketStatusClosed;
    getTicketTypesAsOptions: () => any;
    isTenantContextReady: typeof isTenantContextReady;
};
export declare function useTenantContext(): {
    tenantLocalization: {
        en: {
            PSA_SVC_TRB_CLS: string;
            PSA_SVC_TRB_DON: string;
            PSA_SVC_TRB_DCS: string;
            PSA_SVC_TRB_ACQ: string;
            PSA_SVC_TRB_DSP: string;
            PSA_SVC_CAL: string;
            PSA_SVC_CPL: string;
            PSA_SVC_SUP: string;
            PSA_SVC_TRB: string;
            PSA_SVC_TRB_LIT: string;
        };
    };
    isTicketStatusOpen: typeof isTicketStatusOpen;
    isTicketStatusClosed: typeof isTicketStatusClosed;
    getInitialTicketStatusOpen: typeof getInitialTicketStatusOpen;
    getInitialTicketStatusClosed: typeof getInitialTicketStatusClosed;
    getTicketTypesAsOptions: () => any;
    isTenantContextReady: typeof isTenantContextReady;
};
export {};
