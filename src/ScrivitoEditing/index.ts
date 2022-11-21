import * as Scrivito from "scrivito";

if (Scrivito.isEditorLoggedIn()) {
  Scrivito.extendMenu((menu) => {
    menu.insert({
      id: "ticket-form-configuration",
      title: "Form configuration",
      onClick: () => Scrivito.openDialog("TicketFormConfigDialog"),
    });
  });
}
