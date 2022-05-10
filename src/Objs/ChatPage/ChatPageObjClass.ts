import * as Scrivito from "scrivito";
import metadataAttributes from "../_metadataAttributes";

const ChatPage = Scrivito.provideObjClass("ChatPage", {
  attributes: {
    title: "string",
    formId: "string",
    body: ["widgetlist", { only: "SectionWidget" }],
    ...metadataAttributes as any,
  },
  extractTextAttributes: ["body"],
});

export default ChatPage as any;
