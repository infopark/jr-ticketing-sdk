import * as Scrivito from "scrivito";
import {
  metadataEditingConfigAttributes,
  metadataInitialContent,
  metadataPropertiesGroups,
  metadataValidations,
} from "../_metadataEditingConfig";

Scrivito.provideEditingConfig("ChatPage", {
  title: "Chat Page",
  attributes: {
    ...metadataEditingConfigAttributes,
    title: {
      title: "Title",
      description: "Limit to 55 characters.",
    },
  },
  properties: ["title", "formId"],
  propertiesGroups: [...metadataPropertiesGroups],
  initialContent: {
    ...metadataInitialContent,
  },
  validations: [...metadataValidations as any],
});
