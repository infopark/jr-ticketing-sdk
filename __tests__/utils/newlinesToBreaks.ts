import newlinesToBreaks from "../../src/utils/newlinesToBreaks";

describe("new lines to breaks", () => {
  it("returns text with newlines converted to <br>", () => {
    expect(newlinesToBreaks("test \n")).toEqual("test <br>");
  });
});
