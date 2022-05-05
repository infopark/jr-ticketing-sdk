import * as Scrivito from "scrivito";

const TicketsWidget = Scrivito.provideWidgetClass("TicketsWidget", {
  attributes: {
    link: ["reference", { only: "Page" }],
  },
});

export default TicketsWidget as any;
