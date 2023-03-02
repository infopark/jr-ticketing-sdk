import * as Scrivito from "scrivito";

const TicketListWidget = Scrivito.provideWidgetClass("TicketListWidget", {
  attributes: {
    headline: "string",
    link: ["reference", { only: "TicketPage" }],
  },
  extractTextAttributes: ["headline"],
});

export default TicketListWidget as any;
