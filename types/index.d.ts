/// <reference types="react" />
import { TicketEntry } from "./components/TicketEntry";
interface attachmentFlagProps {
    count: number | string;
    attachmentIcon: string;
}
export declare const TicketList: (name: string) => string;
export declare function AttachmentFlag({ count, attachmentIcon }: attachmentFlagProps): JSX.Element;
export { TicketEntry };
