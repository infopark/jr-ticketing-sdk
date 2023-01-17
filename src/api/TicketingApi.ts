/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from "lodash-es";

import { callApi } from "./callApi";

const ticketingStage = process.env.JR_TICKETING_STAGE || "";
const ticketingPath = [ticketingStage, "ticketing", process.env.SCRIVITO_TENANT]
  .filter(x => !isEmpty(x))
  .join("/");

/** @public */
async function get(endpoint: string, options?): Promise<any> {
  const path = `/${ticketingPath}/${endpoint}`;

  try {
    const response: any = await callApi("get", path);

    return response.data;
  } catch (e) {
    return handleError(e);
  }
}

/** @public */
async function post(endpoint: string, options?): Promise<any> {
  const path = `/${ticketingPath}/${endpoint}`;

  try {
    const response: any = await callApi("post", path, options.data);

    return response.data;
  } catch (e) {
    return handleError(e);
  }
}

/** @public */
async function put(endpoint: string, options?): Promise<any> {
  const path = `/${ticketingPath}/${endpoint}`;

  try {
    const response: any = await callApi("put", path, options.data);

    return response.data;
  } catch (e) {
    return handleError(e);
  }
}

function handleError(error: any) {
  console.error("TicketingApi Error: ", error);

  return {
    error: error.message,
    tooManyIamRedirects: false
  };
}

export default {
  get,
  post,
  put,
};
