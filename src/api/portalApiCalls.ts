import { callApi } from "./callApi";
import { isMockEnabled, mockGet, mockPost } from "./mockEndpoint";
import { isLocalhost } from "../utils/constants";

const callApiGet = async (endpoint) => {
  if (isMockEnabled()) {
    return mockGet(endpoint);
  }
  const instanceId = process.env.SCRIVITO_TENANT;
  const apiUrl = process.env.API_BASE_URL;

  return (await callApi("get", `${apiUrl}/ticketing/${instanceId}/${endpoint}`)).data;
};

const callApiPost = async (endpoint, data) => {
  if (isMockEnabled()) {
    return mockPost(endpoint, data);
  }

  const instanceId = process.env.SCRIVITO_TENANT;
  const apiUrl = process.env.API_BASE_URL;

  return (await callApi("post", `${apiUrl}/ticketing/${instanceId}/${endpoint}`, data)).data;
};

const callApiPut = async (endpoint, data) => {
  if (isMockEnabled()) {
    return mockPost(endpoint, data);
  }

  const instanceId = process.env.SCRIVITO_TENANT;
  const apiUrl = process.env.API_BASE_URL;

  return await callApi("put", `${apiUrl}/ticketing/${instanceId}/${endpoint}`, data);
};

const callApiDelete = async (endpoint, data) => {
  if (isMockEnabled()) {
    return mockPost(endpoint, data);
  }

  const instanceId = process.env.SCRIVITO_TENANT;
  const apiUrl = process.env.API_BASE_URL;

  return await callApi("delete", `${apiUrl}/ticketing/${instanceId}/${endpoint}`);
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

export { callApiGet, callApiPost, callApiPut, callApiDelete, callLogout };
