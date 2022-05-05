import * as Scrivito from "scrivito";

Scrivito.provideEditingConfig("TicketsWidget", {
  title: "Tickets",
  attributes: {
    link: {
      title: "Link to helpdesk",
      description: "",
    },
    formFields: {
      title: "Fieldsnames for ticket creation",
      description: "",
    },
  },
  properties: ["link", "formFields"],
  validations: [
    [
      "link",
      (link) => {
        if (!link) {
          return {
            message: "The link must be set.",
            severity: "error",
          };
        }
      },
    ],
  ],
});
