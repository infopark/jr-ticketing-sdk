import * as Scrivito from "scrivito";

const TicketFormConfiguration: any = Scrivito.provideObjClass(
  "TicketFormConfiguration",
  {
    attributes: {
      uiSchema: "string",
    },
  }
);

export default TicketFormConfiguration;
