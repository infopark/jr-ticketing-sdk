import { startsWith, split, toLower } from "lodash";
import * as Scrivito from "scrivito";
import translations from "./translations";

const getLanguage = () => {
  const current = Scrivito.currentPage();
  return current && current.language();
};

const getDictionary = (localizations, defaultLanguage = "en") => {
  if (!localizations) {
    return {};
  }
  const lang = getLanguage();
  if (!lang) {
    return {};
  }
  return localizations[get2LetterLanguage(lang)] || localizations[defaultLanguage] || {};
};

const get2LetterLanguage = (lang: string | null | undefined) => {
  return toLower(split(lang, /[-_]/g)[0]);
}

const isoToLanguageName = (iso: string) => {
  try {
    const name = new Intl.DisplayNames([iso], {type: 'language'}).of(get2LetterLanguage(iso));
    return name ? name : iso;
  } catch (err) {
    return iso;
  }
}

const translate = (
  key: keyof typeof translations.en | keyof typeof translations.de
) => {
  const lang: keyof typeof translations = startsWith(getLanguage()!, "de") ? "de" : "en";
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

export {
  translate,
  getLanguage,
  getDictionary,
  dictTranslate,
  get2LetterLanguage,
  isoToLanguageName
};
