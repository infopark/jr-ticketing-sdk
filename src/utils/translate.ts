import * as Scrivito from "scrivito";
import translations from "./translations";

const getLanguage = () => {
  const languages = { portalEn: "en", portalDe: "de" };
  const siteId = Scrivito.currentSiteId() || "portalEn";
  return siteId ? languages[siteId] : languages.portalEn;
};

const translate = (
  key: keyof typeof translations.en | keyof typeof translations.de
) => {
  const lang: keyof typeof translations = getLanguage() || "en";
  const keyPresent = Object.keys(translations[lang]).includes(key);
  const langObj: typeof translations[typeof lang] = translations[lang];
  return keyPresent ? langObj[key] : key;
};

const dictTranslate = (key: string, dict: any) => {
  if (!dict) {
    return key;
  }
  const result = dict[key] || key;
  return result;
};

export { translate, getLanguage, dictTranslate };
