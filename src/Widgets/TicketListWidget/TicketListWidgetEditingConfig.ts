import * as Scrivito from "scrivito";

Scrivito.provideEditingConfig("TicketListWidget", {
  title: "Ticket List",
  attributes: {
    link: {
      title: "Link zu chat page",
    },
  },
  properties: ["link"],
  initialContent: {},
  validations: [
    [
      "link",

      (link) => {
        if (!link) {
          return {
            message: "The target must be set.",
            severity: "error",
          };
        }
      },
    ],
  ],
});
