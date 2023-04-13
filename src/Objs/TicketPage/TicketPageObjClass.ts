import * as Scrivito from "scrivito";

import metadataAttributes from "../_metadataAttributes";
import { Keyable } from "../../utils/types";

const TicketPage = Scrivito.provideObjClass("TicketPage", {
  attributes: {
    title: "string",
    uiSchema: "string",
    body: ["widgetlist", { only: "SectionWidget" }],
    ...metadataAttributes as Keyable,
  },
  extractTextAttributes: ["body"],
});

export default TicketPage as any;
