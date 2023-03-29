import React from "react";
import * as Scrivito from "scrivito";

import { TicketFormConfigDialog } from "../../Components/TicketFormConfigDialog";

import {
  metadataEditingConfigAttributes,
  metadataInitialContent,
  metadataPropertiesGroups,
  metadataValidations,
} from "../_metadataEditingConfig";

Scrivito.provideEditingConfig("TicketPage", {
  title: "Ticket Page",
  attributes: {
    ...metadataEditingConfigAttributes,
    title: {
      title: "Title",
      description: "Limit to 55 characters.",
    },
  },
  properties: ["title"],
  propertiesGroups: [
    ...metadataPropertiesGroups,
    {
      title: "Ticket Details",
      key: 'ui-schema',
      component: (props: any) => {
        return <TicketFormConfigDialog object={props.page} />;
      }
    },
  ],
  initialContent: {
    ...metadataInitialContent,
  },
  validations: metadataValidations as any,
});
