import {
  getFileExtension,
  matchExtension,
} from "../../src/utils/fileExtension";

describe("get file extenstion", () => {
  it("returns null if no filename given", () => {
    expect(getFileExtension("")).toBeNull();
    expect(getFileExtension(null)).toBeNull();
  });
  it("returns file extension from fileName", () => {
    expect(getFileExtension("example.jpg")).toEqual("jpg");
    expect(getFileExtension("example.JPEG")).toEqual("jpeg");
  });
});

describe("match extension", () => {
  it("returns correct icon for known filetype", () => {
    expect(matchExtension("example.jpg")).toEqual("test-file-stub.jpg");
  });
});
