import { startsWith, isNil } from "lodash";
import { format as formatDate, parseISO } from "date-fns";
import { enUS, enAU, enGB, de } from "date-fns/locale";
import {
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from "./constants";
import { getLanguage } from "./translate";

const localeMap = {
  en: "en-GB",
  "en-US": "en-US",
  "en-AU": "en-AU",
  "en-GB": "en-GB",
  de: "de-DE",
  "de-DE": "de-DE",
};

const localeObjMap = {
  en: enGB,
  "en-US": enUS,
  "en-AU": enAU,
  "en-GB": enGB,
  de,
  "de-DE": de,
};

const formatsMap = {
  custom0: {
    [DEFAULT_DATE_TIME_FORMAT]: "yyyy-MM-dd HH:mm",
    [DEFAULT_DATE_FORMAT]: "yyyy-MM-dd",
    [DEFAULT_TIME_FORMAT]: "HH:mm",
  },
};

const getTimeLocales = () => {
  const exampleDate = new Date();
  exampleDate.setHours(14);
  exampleDate.setMinutes(3);
  exampleDate.setSeconds(0);
  exampleDate.setMilliseconds(0);
  const timeLocales = ["en-US", "en-AU", "en-GB", "de-DE", "custom0"].map((iso) => ({
    iso,
    name: parseDate(exampleDate, DEFAULT_DATE_TIME_FORMAT, iso),
  }));
  return timeLocales;
}

const mapLocale = (locale: string, fallback = "en-GB") => {
  if (startsWith(locale, "custom")) {
    return locale;
  }
  const result: string = localeMap[locale];
  if (result) {
    return result;
  } else {
    return fallback;
  }
}

const getDateObject = (date) =>
  !(date instanceof Date) ? parseISO(date) : date;

const getFormat = (format, locale) => {
  const formats = formatsMap[locale];
  if (isNil(formats)) {
    return format;
  }
  let mappedFormat = formats[format];
  if (isNil(mappedFormat)) {
    mappedFormat = formats[DEFAULT_DATE_FORMAT];
  }
  if (isNil(mappedFormat)) {
    return format;
  }
  return mappedFormat;
};

const getLocale = (locale) => {
  const nonEmptyLocale = getNonEmptyLocale(locale);
  const localeObject = getLocaleObject(nonEmptyLocale);
  return localeObject;
};
const getNonEmptyLocale = (locale) =>
  (!startsWith(locale, "custom") ? locale : undefined) || getLanguage();
const getLocaleObject = (locale) => localeObjMap[locale] || enGB;

const parseDate = (date, format = DEFAULT_DATE_FORMAT, locale) => {
  const dateObject = getDateObject(date);
  const mappedFormat = getFormat(format, locale);
  const localeObject = getLocale(locale);
  const parsedDate = formatDate(dateObject, mappedFormat, {
    locale: localeObject,
  });
  return parsedDate;
};

export { parseDate, getTimeLocales, mapLocale };
