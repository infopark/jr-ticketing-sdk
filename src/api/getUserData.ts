import { callApiGet } from "./portalApiCalls";

const getUserData = async () => callApiGet(`get-user`);
export default getUserData;
