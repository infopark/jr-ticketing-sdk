import * as Scrivito from "scrivito";

const HeadlineWidget = Scrivito.provideWidgetClass("HeadlineWidget", {
  attributes: {
    headline: "string",
    style: ["enum", { values: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    showChapterNumber: "boolean",
  },
  extractTextAttributes: ["headline"],
});

export default HeadlineWidget as any;
