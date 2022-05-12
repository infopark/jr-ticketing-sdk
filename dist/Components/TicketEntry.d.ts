/// <reference types="react" />
import * as Scrivito from "scrivito";
interface ticketEntryProps {
    ticket: {
        status: string;
        creationdate: string;
        title: string;
        description: string;
        attachmentcount: number;
        ticketnum: string;
    };
    targetLink: Scrivito.Link;
    statusDictionary: object;
    timeLocale: string;
}
export declare function TicketEntry({ ticket, targetLink, statusDictionary, timeLocale, }: ticketEntryProps): JSX.Element;
export {};
