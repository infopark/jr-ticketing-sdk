import * as Scrivito from "scrivito";

const EditProfileWidget = Scrivito.provideWidgetClass("EditProfileWidget", {
  attributes: {
    widget: ["widgetlist", { only: "TeaserBoxWidget" }],
  },
});

export default EditProfileWidget as any;
