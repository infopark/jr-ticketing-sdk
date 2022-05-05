import axios from "axios";
import { isMockEnabled, mockGet, mockPost } from "./mockEndpoint";

const callApiPost = async (endpoint, body) => {
  if (isMockEnabled()) {
    return mockPost(endpoint, body);
  }
  const stage = process.env.API_DEPLOYMENT_STAGE || "develop";
  const apiUrl = process.env.API_BASE_URL;
  const config = { withCredentials: true };
  addSkipIamHeader(config);

  try {
    const result = await axios
      .post(`${apiUrl}/${stage}/${endpoint}`, body, config)
      .then((response) => response.data);
    return result;
  } catch (error: any) {
    return checkIamAuthRedirect(error.response);
  }
};

const callApiGet = async (endpoint) => {
  if (isMockEnabled()) {
    return mockGet(endpoint);
  }
  const stage = process.env.API_DEPLOYMENT_STAGE || "develop";
  const apiUrl = process.env.API_BASE_URL;
  const config = { withCredentials: true };
  addSkipIamHeader(config);

  try {
    const result = await axios
      .get(`${apiUrl}/${stage}/${endpoint}`, config)
      .then((response) => response.data);
    return result;
  } catch (error: any) {
    return checkIamAuthRedirect(error.response);
  }
};

const callLogout = () => {
  if (isMockEnabled()) {
    window.location.reload();
    return;
  }
  const domain = window.location.host;
  window.location.href = `${window.location.protocol}//jr-api.${domain}/iam/logout`;
};

const RETURN_TO_PLACEHOLDER = "$RETURN_TO";
const API_LOCATION_PLACEHOLDER = "$JR_API_LOCATION";
const IAM_MISSING_AUTH_CODE = "auth_missing";
const IAM_MISSING_AUTH_CODE_LEGACY = "auth.missing";
const IAM_REDIRECT_TIMEOUT_MS = 5000; // within 5 seconds, second of consecutive iam redirects blocked
const LS_LAST_REDIRECT_TIMESTAMP = "last-iam-redirect-timestamp";

function addSkipIamHeader(config) {
  if (
    process.env.JR_IAM_SKIP_USER &&
    window.location.hostname === "localhost"
  ) {
    config.headers = { "jr-skip-iam": process.env.JR_IAM_SKIP_USER };
  }
}

function checkIamAuthRedirect(response) {
  const responseStatus = response?.status;
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
  const domain = window.location.host;

  let url = result.details.visit;
  url = url
    .replace(RETURN_TO_PLACEHOLDER, encodeURIComponent(window.location.origin))
    .replace(
      API_LOCATION_PLACEHOLDER,
      `${window.location.protocol}//jr-api.${domain}`
    );

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

export { callApiPost, callApiGet, callLogout };
