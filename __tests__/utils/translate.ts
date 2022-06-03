import { translate } from "../../src/utils/translate";
import * as Scrivito from "../../__mocks__/scrivito";

describe("translations", () => {
  it("returns en translation", () => {
    expect(translate("Description")).toEqual("Description");
  });
  it("returns de translation", () => {
    const spy = jest
      .spyOn(Scrivito, "currentSiteId")
      .mockImplementation(() => "portalDe");
    expect(translate("Description")).toEqual("Beschreibung");
    spy.mockRestore();
  });
});
