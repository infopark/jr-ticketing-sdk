import React from "react";
import * as Scrivito from "scrivito";

import { TicketFormConfigDialog, TicketFormConfigDialogMode } from "../../Components/TicketFormConfigDialog";

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
      title: "UI Schema",
      key: 'ui-schema',
      component: (props: any) => {
        return <TicketFormConfigDialog object={props.page} mode={TicketFormConfigDialogMode.DETAILS} />;
      }
    },
  ],
  initialContent: {
    ...metadataInitialContent,
  },
  validations: metadataValidations as any,
});
