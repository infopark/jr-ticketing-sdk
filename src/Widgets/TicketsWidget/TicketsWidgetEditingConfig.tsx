import React from "react";
import * as Scrivito from "scrivito";

import { TicketFormConfigDialog } from "../../Components/TicketFormConfigDialog";

Scrivito.provideEditingConfig("TicketsWidget", {
  title: "Tickets",
  attributes: {
    link: {
      title: "Link to helpdesk",
      description: "",
    },
  },
  properties: ["link"],
  propertiesGroups: [{
    title: "Create Ticket Form",
    key: 'ui-schema',
    component: (props: any) => {
      return <TicketFormConfigDialog object={props.widget} />;
    }
  }],
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
