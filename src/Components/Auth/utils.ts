const LS_AUTH_STATE = "jr-portal-iam-auth-state";
const LS_USER_UUID = "jr-portal-user-uuid";
const isLoggedIn = () =>
  window.localStorage.getItem(LS_AUTH_STATE) === "signedIn";

const setLoggedIn = (value) => {
  if (value) {
    window.localStorage.setItem(LS_AUTH_STATE, "signedIn");
  } else {
    window.localStorage.removeItem(LS_AUTH_STATE);
  }
};

const getUserUuid = () => window.localStorage.getItem(LS_USER_UUID);
const setUserUuid = (uuid) => window.localStorage.setItem(LS_USER_UUID, uuid);
const removeUserUuid = () => window.localStorage.removeItem(LS_USER_UUID);
const userLanguageHandled = () =>
  window.sessionStorage.getItem("defaultLanguageHandled");
const setUserLanguageHandledFlag = () =>
  window.sessionStorage.setItem("defaultLanguageHandled", "true");
const removeUserLanguageHandledFlag = () =>
  window.sessionStorage.removeItem("defaultLanguageHandled");
export default isLoggedIn;
export {
  setLoggedIn,
  getUserUuid,
  setUserUuid,
  removeUserUuid,
  userLanguageHandled,
  setUserLanguageHandledFlag,
  removeUserLanguageHandledFlag,
};
