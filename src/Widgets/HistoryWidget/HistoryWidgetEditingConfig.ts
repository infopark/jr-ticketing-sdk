import * as Scrivito from "scrivito";

Scrivito.provideEditingConfig("HistoryWidget", {
  title: "History",
  properties: ["links", "initialHeadline", "headline"],
  initialContent: {
    headline: "Kürzlich gelesen",
  },
  validations: [
    [
      "links",
      (links) => {
        if ((links as unknown[]).length < 1) {
          return {
            message: "At least 1 link required",
            severity: "error",
          };
        }
      },
    ],
  ],
});
