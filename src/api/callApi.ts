import axios from "axios";

const METHODS_WITH_BODY = ["POST", "PUT", "PATCH"];

async function callApi(method, url, data = {}) {
  const options: any = {
    method: method,
    url: url,
    withCredentials: true,
  };

  if (METHODS_WITH_BODY.includes(method.toUpperCase())) {
    options.data = data;
  }

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: any) {
    return checkIamAuthRedirect(error.response);
  }
}

const RETURN_TO_PLACEHOLDER = "$RETURN_TO";
const API_LOCATION_PLACEHOLDER = "$JR_API_LOCATION";
const IAM_MISSING_AUTH_CODE = "auth_missing";
const IAM_MISSING_AUTH_CODE_LEGACY = "auth.missing";
const IAM_REDIRECT_TIMEOUT_MS = 5000; // within 5 seconds, second of consecutive iam redirects blocked
const LS_LAST_REDIRECT_TIMESTAMP = "last-iam-redirect-timestamp";

function checkIamAuthRedirect(response) {
  const responseStatus = response && response.status;
  const synthResponse = {
    failedRequest: true,
    statusCode: responseStatus || 404,
    tooManyIamRedirects: false,
    redirectUrl: undefined
  };
  if (responseStatus !== 401) {
    return synthResponse;
  }
  const result = response.data;
  if (
    result.code !== IAM_MISSING_AUTH_CODE &&
    result.code !== IAM_MISSING_AUTH_CODE_LEGACY
  ) {
    return synthResponse;
  }

  const apiUrl = process.env.API_BASE_URL;
  const url = result.details.visit
    .replace(RETURN_TO_PLACEHOLDER, encodeURIComponent(window.location.href))
    .replace(API_LOCATION_PLACEHOLDER, apiUrl);

  if (isRepeatedIamRedirect()) {
    synthResponse.statusCode = 421;
    synthResponse.tooManyIamRedirects = true;
    synthResponse.redirectUrl = url;
    return synthResponse;
  }
  setIamRedirectTimestamp();

  window.location.href = `${url}`;

  synthResponse.statusCode = 200;
  return synthResponse;
}

function isRepeatedIamRedirect() {
  const timestamp = parseInt(
    localStorage.getItem(LS_LAST_REDIRECT_TIMESTAMP)!,
    10
  );
  if (isNaN(timestamp)) {
    return false;
  }
  const timeDiffMs = Date.now() - timestamp;
  return timeDiffMs < IAM_REDIRECT_TIMEOUT_MS;
}

function setIamRedirectTimestamp() {
  localStorage.setItem(LS_LAST_REDIRECT_TIMESTAMP, Date.now().toString());
}

export { callApi };
