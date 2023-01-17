import TicketingApi from "./TicketingApi";

const getUserData = async () => await TicketingApi.get("userinfo");

export default getUserData;
