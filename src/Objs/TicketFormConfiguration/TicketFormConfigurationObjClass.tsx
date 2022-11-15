import * as Scrivito from "scrivito";

const TicketFormConfiguration: any = Scrivito.provideObjClass(
  "TicketFormConfiguration",
  {
    attributes: {
      formSchema: "string",
      uiSchema: "string",
    },
  }
);

export default TicketFormConfiguration;
