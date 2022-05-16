import * as Scrivito from "scrivito";

const HistoryWidget = Scrivito.provideWidgetClass("HistoryWidget", {
  attributes: {
    headline: "string",
    initialHeadline: "string",
    links: [
      "referencelist",
      {
        only: [
          "TrainingPage",
          "TrainingHomePage",
          "DocumentationHomePage",
          "DocumentationPage",
        ],
      },
    ],
  },
  extractTextAttributes: ["headline"],
});

export default HistoryWidget as any;
