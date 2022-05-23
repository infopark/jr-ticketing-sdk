import { translate } from "../../utils/translate";
const getLanguage = () => "de";
describe("translations", () => {
  describe("translate", () => {
    it("returns translation", () => {
      expect(translate("Description")).toEqual("Description");
    });
  });
});
