import * as Scrivito from "scrivito";
import metadataAttributes from "../_metadataAttributes";

const TicketPage = Scrivito.provideObjClass("TicketPage", {
  attributes: {
    title: "string",
    formId: "string",
    body: ["widgetlist", { only: "SectionWidget" }],
    ...metadataAttributes as any,
  },
  extractTextAttributes: ["body"],
});

export default TicketPage as any;
