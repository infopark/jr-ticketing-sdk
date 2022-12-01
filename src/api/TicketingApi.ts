import { isEmpty } from "lodash-es";
import { unstable_JrRestApi } from "scrivito";

unstable_JrRestApi.configure({
  endpoint: process.env.JR_API_LOCATION || ""
});

const ticketingStage = process.env.JR_TICKETING_STAGE || "";
const ticketingPath = [ticketingStage, "ticketing", process.env.SCRIVITO_TENANT]
  .filter(x => !isEmpty(x))
  .join("/");

/** @public */
export class TicketingApi {
  static async get(endpoint: string, options?): Promise<any> {
    const path = `${ticketingPath}/${endpoint}`;

    try {
      const response: any = await unstable_JrRestApi.get(path, options);

      return response.data;
    } catch (e) {
      return handleError(e);
    }
  }

  static async post(endpoint: string, options?): Promise<any> {
    const path = `${ticketingPath}/${endpoint}`;

    try {
      const response: any = await unstable_JrRestApi.post(path, options);

      return response.data;
    } catch (e) {
      return handleError(e);
    }
  }

  static async put(endpoint: string, options?): Promise<any> {
    const path = `${ticketingPath}/${endpoint}`;

    try {
      const response: any = await unstable_JrRestApi.put(path, options);

      return response.data;
    } catch (e) {
      return handleError(e);
    }
  }
}

function handleError(error: any) {
  console.log("TicketingApi Error: ", error);
  return {
    error: error.message,
    tooManyIamRedirects: false
  };
}

export default TicketingApi;
