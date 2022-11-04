import { callApiGet } from "./portalApiCalls";

const getUserData = async () => callApiGet("userinfo");

export default getUserData;
