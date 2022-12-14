const DEFAULT_DATE_TIME_FORMAT = "PPp";
const DEFAULT_DATE_FORMAT = "PP";
const DEFAULT_TIME_FORMAT = "p";
const ISO_DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const PISA_DATE_TIME_FORMAT = "YYYYMMDDHHmmss";

const isLocalhost = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  }
  return false;
};

const CDN_BASE_PATH = process.env.CUSTOMER_PORTAL_SDK_CDN_URL || window.location.origin;

const MAX_ATTACHMENT_SIZE = 20000000;

export {
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  ISO_DATE_TIME_FORMAT,
  PISA_DATE_TIME_FORMAT,
  CDN_BASE_PATH,
  MAX_ATTACHMENT_SIZE,
  isLocalhost,
};
