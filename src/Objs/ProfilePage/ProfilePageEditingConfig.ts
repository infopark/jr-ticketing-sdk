import * as Scrivito from "scrivito";
import { PROFILE_PAGE_PROVIDER, waitForInitialContentBodyProvider } from "../../Bridge/InitialContentBodyFactory";
import {
  metadataEditingConfigAttributes,
  metadataInitialContent,
  metadataPropertiesGroups,
  metadataValidations,
} from "../_metadataEditingConfig";

waitForInitialContentBodyProvider(PROFILE_PAGE_PROVIDER).then((bodyProvider) => {  
  Scrivito.provideEditingConfig("ProfilePage", {
    title: "Profile Page",
    attributes: {
      ...metadataEditingConfigAttributes,
      title: {
        title: "Title",
        description: "Limit to 55 characters.",
      },
    },
    properties: ["title"],
    propertiesGroups: [...metadataPropertiesGroups],
    initialContent: {
      body: bodyProvider(),
      ...metadataInitialContent,
    },
    validations: [...metadataValidations as any],
  });
});
