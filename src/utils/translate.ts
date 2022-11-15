import { startsWith, split, toLower } from "lodash";
import * as Scrivito from "scrivito";

import i18n from "../config/i18n";
const DEFAULT_LANGUAGE = "en";

const getLanguage = () => {
  const current = Scrivito.currentPage();
  if (current) {
    return current.language() || DEFAULT_LANGUAGE;
  }
  return DEFAULT_LANGUAGE;
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

const translate = (key: string) => {
  return i18n.t(key);
};

export {
  translate,
  getLanguage,
  getDictionary,
  get2LetterLanguage,
  isoToLanguageName
};
