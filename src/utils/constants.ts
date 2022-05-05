const DEFAULT_DATE_TIME_FORMAT = "PPp";
const DEFAULT_DATE_FORMAT = "PP";
const DEFAULT_TIME_FORMAT = "p";
const ISO_DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const PISA_DATE_TIME_FORMAT = "YYYYMMDDHHmmss";
const DEFAULT_LOCATION_HOSTNAME = "jr-customer-portal-develop.justrelate.io";
const DEFAULT_LOCATION_ORIGIN =
  "https://jr-customer-portal-develop.justrelate.io";

const isLocalhost = () =>
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const CDN_BASE_PATH = isLocalhost()
  ? DEFAULT_LOCATION_ORIGIN
  : window.location.origin;

const DEVELOPMENT_ENVIRONMENT =
  isLocalhost() || window.location.hostname === DEFAULT_LOCATION_HOSTNAME;

const MAX_ATTACHMENT_SIZE = 20000000;

export {
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_LOCATION_ORIGIN,
  ISO_DATE_TIME_FORMAT,
  PISA_DATE_TIME_FORMAT,
  CDN_BASE_PATH,
  DEVELOPMENT_ENVIRONMENT,
  MAX_ATTACHMENT_SIZE,
};
