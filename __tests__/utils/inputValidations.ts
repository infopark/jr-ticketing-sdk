import {
  attachmentSize,
  inputMaxSize,
  inputMinSize,
} from "../../src/utils/inputValidations";

const mockEvent = {
  target: {
    value: "example text inupt value",
    files: [{ size: 1000 }],
  },
};

describe("file input validations", () => {
  it("returns true if file too big", () => {
    expect(attachmentSize(mockEvent, 500)).toEqual(true);
  });
  it("returns false if file within size limit", () => {
    expect(attachmentSize(mockEvent, 2000)).toEqual(false);
  });
});

describe("text input validations", () => {
  it("returns true if input value too long", () => {
    expect(inputMaxSize(mockEvent, 10)).toEqual(true);
  });
  it("returns false if input value within limit", () => {
    expect(inputMaxSize(mockEvent, 100)).toEqual(false);
  });
  it("returns false if input value long enough", () => {
    expect(inputMinSize(mockEvent, 10)).toEqual(false);
  });
  it("returns true if input value not long enough", () => {
    expect(inputMinSize(mockEvent, 100)).toEqual(true);
  });
});
