import * as Scrivito from "scrivito";
import metadataAttributes from "../_metadataAttributes";

const ProfilePage = Scrivito.provideObjClass("ProfilePage", {
  attributes: {
    title: "string",
    body: ["widgetlist", { only: "SectionWidget" }],
    ...metadataAttributes as any,
  },
  extractTextAttributes: ["body"],
});

export default ProfilePage as any;
