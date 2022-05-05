declare const isLoggedIn: () => boolean;
declare const setLoggedIn: (value: any) => void;
declare const getUserUuid: () => string | null;
declare const setUserUuid: (uuid: any) => void;
declare const removeUserUuid: () => void;
declare const userLanguageHandled: () => string | null;
declare const setUserLanguageHandledFlag: () => void;
declare const removeUserLanguageHandledFlag: () => void;
export default isLoggedIn;
export { setLoggedIn, getUserUuid, setUserUuid, removeUserUuid, userLanguageHandled, setUserLanguageHandledFlag, removeUserLanguageHandledFlag, };
