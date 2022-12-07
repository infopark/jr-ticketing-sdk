import I18n from "i18next"

import en from "./locales/en.json"
import de from "./locales/de.json"

const i18n = I18n.createInstance({
  lng: "de",
  fallbackLng: "de",
  resources: {
    en: { portal: en },
    de: { portal: de },
  },
  ns: ["portal"],
  defaultNS: ['portal'],
  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },
}, (err, t) => {
  if (err) {
    console.log("I18n.init failed", err);
  }
  t('key');
})

export default i18n;
