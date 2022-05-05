declare const isMockEnabled: () => boolean;
declare const mockGet: (endpoint: any) => {};
declare const mockPost: (endpoint: any, body?: any) => {};
export { isMockEnabled, mockGet, mockPost };
