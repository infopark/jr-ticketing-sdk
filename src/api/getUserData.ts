import { callApiGet } from "./portalApiCalls";

const getUserData = async () => await callApiGet("userinfo");

export default getUserData;
