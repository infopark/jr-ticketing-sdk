import { format as formatDate, parseISO } from "date-fns";
import { enUS, enAU, enGB, de } from "date-fns/locale";

import i18n from "../config/i18n";
import {
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from "./constants";

const localeObjMap = {
  en: enGB,
  "en-US": enUS,
  "en-AU": enAU,
  "en-GB": enGB,
  de,
  "de-DE": de,
};

const formatsMap = {
  [DEFAULT_DATE_TIME_FORMAT]: "yyyy-MM-dd HH:mm",
  [DEFAULT_DATE_FORMAT]: "yyyy-MM-dd",
  [DEFAULT_TIME_FORMAT]: "HH:mm",
};

const getDateObject = (date) =>
  !(date instanceof Date) ? parseISO(date) : date;

const getFormat = (format: string) => {
  let mappedFormat = formatsMap[format];
  if (mappedFormat) {
    mappedFormat = formatsMap[DEFAULT_DATE_FORMAT];
  }
  if (mappedFormat) {
    return format;
  }
  return mappedFormat;
};

const getLocale = (locale: string) => localeObjMap[locale] || enGB;

const parseDate = (date, format = DEFAULT_DATE_FORMAT) => {
  const language = i18n.language;

  const dateObject = getDateObject(date);
  const mappedFormat = getFormat(format);
  const localeObject = getLocale(language);
  const parsedDate = formatDate(dateObject, mappedFormat, {
    locale: localeObject,
  });
  return parsedDate;
};

export { parseDate };
