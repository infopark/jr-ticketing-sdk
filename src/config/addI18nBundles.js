import deepmerge from "deepmerge";
import { isEmpty } from "lodash-es";

import i18n from "./i18n"

import en from "./locales/en.json"
import de from "./locales/de.json"

/**
 * Add locale bundles such as new translations for a language or multiple languages.
 *
 * @param {hash} locales usually from the store such, i.e. {en: {...}, de: {...}}
 */
export default function addI18nBundles(locales) {
  if (isEmpty(locales)) {
    return;
  }

  i18n.addResourceBundle("en", "portal", deepmerge(en, locales.en || {}))
  i18n.addResourceBundle("de", "portal", deepmerge(de, locales.de || {}))
}
