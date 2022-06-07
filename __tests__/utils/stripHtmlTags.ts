import stripHtmlTags from "../../src/utils/stripHtmlTags";
const exampleHtml =
  "<script>console.log('foo')</script><style>body{color:red}</style><div>lorem</div><ul><li>list item</li></ul><br /><br><p>paragraph</p>";
const sanitizedText = "lorem\n  *  list item\n\n\n\nparagraph\n";
describe("strip html tags", () => {
  it("returns sanitised text", () => {
    expect(stripHtmlTags(exampleHtml)).toEqual(sanitizedText);
  });
});
