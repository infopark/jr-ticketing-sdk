/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from "lodash-es";
import { unstable_JrRestApi } from "scrivito";

const ticketingStage = process.env.JR_TICKETING_STAGE || "";
const ticketingPath = [ticketingStage, "ticketing", process.env.SCRIVITO_TENANT]
  .filter(x => !isEmpty(x))
  .join("/");

/** @public */
async function get(endpoint: string, options?): Promise<any> {
  const path = `${ticketingPath}/${endpoint}`;

  const response: any = await unstable_JrRestApi.get(path, options);

  return response.data;
}

/** @public */
async function post(endpoint: string, options?): Promise<any> {
  const path = `${ticketingPath}/${endpoint}`;

  const response: any = await unstable_JrRestApi.post(path, options);

  return response.data;
}

/** @public */
async function put(endpoint: string, options?): Promise<any> {
  const path = `${ticketingPath}/${endpoint}`;

  const response: any = await unstable_JrRestApi.put(path, options);

  return response.data;
}

export default {
  get,
  post,
  put,
};
