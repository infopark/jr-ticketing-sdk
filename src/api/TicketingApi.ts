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

  try {
    const response: any = await unstable_JrRestApi.get(path, options);

    return response.data;
  } catch (e) {
    return handleError(e);
  }
}

/** @public */
async function post(endpoint: string, options?): Promise<any> {
  const path = `${ticketingPath}/${endpoint}`;

  try {
    const response: any = await unstable_JrRestApi.post(path, options);

    return response.data;
  } catch (e) {
    return handleError(e);
  }
}

/** @public */
async function put(endpoint: string, options?): Promise<any> {
  const path = `${ticketingPath}/${endpoint}`;

  try {
    const response: any = await unstable_JrRestApi.put(path, options);

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
