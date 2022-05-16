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
        if ((links as any).length < 1) {
          return {
            message: "At least 1 link required",
            severity: "error",
          };
        }
      },
    ],
    [
      "links",
      (links) => {
        const allowedPageTypes = [
          "TrainingPage",
          "TrainingHomePage",
          "DocumentationHomePage",
          "DocumentationPage",
        ];
        const trainingPageLinks = (links as any).filter(
          (link) => !allowedPageTypes.includes(link.objClass())
        );

        if (trainingPageLinks.length) {
          return {
            message:
              "Only Trainning (Academy) Pages or Documentation Pages can be used as initial links for this widget",
            severity: "error",
          };
        }
      },
    ],
  ],
});
