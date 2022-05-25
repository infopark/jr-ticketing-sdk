export const PROFILE_PAGE_PROVIDER = "profile-page";

// any: Scrivito does not export WidgetClass or AttributeDefinitions 
export type InitialContentBodyProvider = () => Array<any>;
export type InitialContentBodyProviderId = "profile-page";
export type ProviderCallbackCall = (i: InitialContentBodyProvider) => void;

const EMPTY_PROVIDER = () => { return []; };

export interface ProviderCallback {
    getProvider(): InitialContentBodyProvider;
    setProvider(p: InitialContentBodyProvider): void;
    then(c: ProviderCallbackCall): void;
    triggerCallbacks(): void;
}

export function ProviderCallback(
    this: {_contentProvider: InitialContentBodyProvider, _callbacks: Array<ProviderCallbackCall>}, 
    p: InitialContentBodyProvider
) {      
    this._contentProvider = p;
    this._callbacks = [];
}

ProviderCallback.prototype.getProvider = function(): InitialContentBodyProvider {
    return this._contentProvider;
}

ProviderCallback.prototype.setProvider = function(p: InitialContentBodyProvider): void {
    this._contentProvider = p;
    if (this._contentProvider !== EMPTY_PROVIDER) {
        this.triggerCallbacks();
    }
}

ProviderCallback.prototype.then = function(c: ProviderCallbackCall): void {
    if (this._contentProvider !== EMPTY_PROVIDER) {
        c.call(this, this._contentProvider);
    } else {
        this._callbacks.push(c);
    }
}    

ProviderCallback.prototype.triggerCallbacks = function(): void {
    this._callbacks.forEach((c) => {
        c.call(this, this._contentProvider);
    });
    this._callbacks = [];
}

const RESOLVERS: {[key:string]: ProviderCallback} = {};

export function setInitialContentBodyProvider(id: InitialContentBodyProviderId, provider: InitialContentBodyProvider): void {
    const resolver = RESOLVERS[id];    
    if (resolver !== undefined) {    
        resolver.setProvider(provider);
    } else {
        RESOLVERS[id] = new ProviderCallback(provider);
    }
}

export function waitForInitialContentBodyProvider(id: InitialContentBodyProviderId): ProviderCallback {    
    const resolver = RESOLVERS[id];
    if (resolver === undefined) {
        RESOLVERS[id] = new ProviderCallback(EMPTY_PROVIDER);
    }
    return RESOLVERS[id];
}

