import * as Scrivito from "scrivito";
import {
  metadataEditingConfigAttributes,
  metadataInitialContent,
  metadataPropertiesGroups,
  metadataValidations,
} from "../_metadataEditingConfig";

Scrivito.provideEditingConfig("TicketPage", {
  title: "Chat Page",
  attributes: {
    ...metadataEditingConfigAttributes,
    title: {
      title: "Title",
      description: "Limit to 55 characters.",
    },
    ticketsLink: {
      title: "Link to tickets list page",
    },
  },
  properties: ["title", "formId", "ticketsLink"],
  propertiesGroups: [...metadataPropertiesGroups],
  initialContent: {
    ...metadataInitialContent,
  },
  validations: [
    ...metadataValidations as any,
    [
      "ticketsLink",

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
