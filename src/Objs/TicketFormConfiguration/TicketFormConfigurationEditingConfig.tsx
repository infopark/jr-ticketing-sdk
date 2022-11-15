import * as Scrivito from "scrivito";

Scrivito.provideEditingConfig("TicketFormConfiguration", {
  attributes: {
    formSchema: {},
    uiSchema: {},
  },
  properties: ["formSchema", "uiSchema"],
  hideInSelectionDialogs: true,
});
