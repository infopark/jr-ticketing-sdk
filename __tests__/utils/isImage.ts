import { isImage, isImageFormat } from "../../src/utils/isImage";

describe("isImage", () => {
  it("returns true for knonw image file extensions", () => {
    expect(isImageFormat("jpg")).toEqual(true);
    expect(isImageFormat("png")).toEqual(true);
    expect(isImageFormat("JPEG")).toEqual(true);
    expect(isImageFormat("txt")).toEqual(false);
  });
  it("returns null if no extension provided", () => {
    expect(isImageFormat(null)).toEqual(null);
  });
});
