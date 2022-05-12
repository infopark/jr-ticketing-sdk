import * as Scrivito from "scrivito";
import headlineWidgetIcon from "../../assets/images/headline_widget.svg";

Scrivito.provideEditingConfig("HeadlineWidget", {
  title: "Headline",
  thumbnail: headlineWidgetIcon,
  attributes: {
    style: {
      title: "Style",
      description: "Size and font of this headline. Default: Heading 2",
      values: [
        { value: "h1", title: "Heading 1" },
        { value: "h2", title: "Heading 2" },
        { value: "h3", title: "Heading 3" },
        { value: "h4", title: "Heading 4" },
        { value: "h5", title: "Heading 5" },
        { value: "h6", title: "Heading 6" },
      ],
    },
    showChapterNumber: {
      title: "Show chapter number?",
      description: "Show the number of chapter. Default: No",
    },
  },
  properties: ["style", "showChapterNumber"],
  initialContent: {
    headline: "Lorem Ipsum",
    showChapterNumber: false,
    style: "h2",
  },
  validations: [
    [
      "headline",

      (headline) => {
        if (!headline) {
          return { message: "The headline must be set.", severity: "error" };
        }
      },
    ],
  ],
});
