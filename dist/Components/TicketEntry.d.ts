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
    userData: {
        timelocale: string;
    };
}
export declare function TicketEntry({ ticket, targetLink, statusDictionary, userData, }: ticketEntryProps): JSX.Element;
export {};
