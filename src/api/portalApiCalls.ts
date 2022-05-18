import axios from "axios";
import { isMockEnabled, mockGet, mockPost } from "./mockEndpoint";
import { isLocalhost } from "../utils/constants";

const callApiPost = async (endpoint, body) => {
  if (isMockEnabled()) {
    return mockPost(endpoint, body);
  }
  const stage = process.env.API_DEPLOYMENT_STAGE || "develop";
  const apiUrl = process.env.API_BASE_URL;
  const config = { withCredentials: true };

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
  const apiUrl = getApiTargetUrl();
  window.location.href = `${apiUrl}/iam/logout`;
};

const getApiTargetUrl = () => {
  const domain = window.location.host;
  if (isLocalhost()) {
    return `${window.location.protocol}//${domain}`;
  }
  return `${window.location.protocol}//jr-api.${domain}`;
};

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

  const apiTargetUrl = getApiTargetUrl();
  let url = result.details.visit;
  url = url
    .replace(RETURN_TO_PLACEHOLDER, encodeURIComponent(window.location.origin))
    .replace(API_LOCATION_PLACEHOLDER, `${apiTargetUrl}`);

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
