type Callback = (msg: string) => void;

let delay = 1;

class WS {
  private url: string;
  private ws: WebSocket | undefined;
  private listeners: { [key: string]: Callback[] };
  private instanceId: string | undefined;
  private timer: NodeJS.Timer | undefined;
  private lastAutoRefreshed: number | undefined;

  constructor (url: string) {
    this.url = url;
    this.listeners = {};
  }

  init(instanceId: string) {
    this.instanceId = instanceId;
    this._init();
  }

  handleFocusChange() {
    if (document.visibilityState === "visible") {
      this.autoRefresh();
    }
  }

  autoRefresh() {
    if (document.visibilityState !== "visible") return;

    if(this.lastAutoRefreshed && new Date().getTime() - this.lastAutoRefreshed < 5000) return;
    this.lastAutoRefreshed = new Date().getTime();

    Object.values(this.listeners).forEach((callbacks) => {
      callbacks.forEach((callback) => {
        callback("dummy");
      });
    });
  }

  _init() {
    this.close();

    if (!this.timer) {
      this.timer = setInterval(() => {
        this.autoRefresh();
      }, 1*60*1000);

      document.addEventListener("visibilitychange", this.handleFocusChange.bind(this));
      document.addEventListener("focus", this.autoRefresh.bind(this));
    }

    // NOTE: Disable WebSockets until authentication issue is solved
    return;

    const ws = new WebSocket(`${this.url}/ticketing/${this.instanceId}`);

    ws.addEventListener("close", () => {
      setTimeout(() => {
        if (delay < 60) delay = delay * 2;
        this._init();
      }, delay * 1000);
    });

    ws.addEventListener("message", (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      switch (data.cmd) {
        case "READY": {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
            window.removeEventListener("visibilitychange", this.handleFocusChange.bind(this));
            window.removeEventListener("focus", this.autoRefresh.bind(this));
          }
          this.ws = ws;
          delay = 1;

          Object.keys(this.listeners).forEach(channel => {
            this.ws?.send(JSON.stringify({
              cmd: "SUBSCRIBE",
              channel: channel
            }));
          });
          break;
        }

        case "DATA": {
          this.listeners[data.channel]?.forEach((callback) => {
            callback(data.payload);
          });
          break;
        }
      }
    });
  }

  close() {
    if (!this.ws) return;

    this.ws.close();
    this.ws = undefined;
  }

  subscribe(...channelParts: unknown[]) {
    const callback: Callback = channelParts.pop() as Callback;
    const channel = channelParts.filter(e => !!e).join("/");

    this.listeners[channel] ||= [];
    this.listeners[channel].push(callback);

    if (this.listeners[channel].length === 1) {
      this.ws?.send(JSON.stringify({
        cmd: "SUBSCRIBE",
        channel: channel
      }));
    }

    return () => {
      this.listeners[channel] = this.listeners[channel].filter(cb => cb !== callback);
      if (this.listeners[channel].length > 0) return;

      this.ws?.send(JSON.stringify({
        cmd: "UNSUBSCRIBE",
        channel: channel
      }));

      delete this.listeners[channel];
    };
  }
}

const url = process.env.JR_REST_API_ENDPOINT?.replace(/^http:\/\//, "ws://").replace(/^https:\/\//, "wss://");
const ws: WS = new WS(`${url}`);

export default ws;
