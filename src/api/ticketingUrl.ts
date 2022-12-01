export default function ticketingUrl(): string {
  const stage = process.env.JR_TICKETING_STAGE || "";
  const endpoint = process.env.JR_REST_API_ENDPOINT || "";
  const instanceId = process.env.SCRIVITO_TENANT || "";

  return [endpoint, stage, "ticketing", instanceId].filter(x => !!x).join("/");
}
