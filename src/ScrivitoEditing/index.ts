import * as Scrivito from "scrivito";

Scrivito.load(() => Scrivito.isEditorLoggedIn() && Scrivito.canWrite()).then((editable) => {
  if (editable) {
    // Scrivito.extendMenu((menu) => {
    //   menu.insert({
    //     id: "ticket-form-configuration",
    //     title: "Form configuration",
    //     onClick: () => Scrivito.openDialog("TicketFormConfigDialog"),
    //   });
    // });
  }
});
