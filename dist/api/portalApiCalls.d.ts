declare const callApiPost: (endpoint: any, body: any) => Promise<any>;
declare const callApiGet: (endpoint: any) => Promise<any>;
declare const callLogout: () => void;
export { callApiPost, callApiGet, callLogout };
