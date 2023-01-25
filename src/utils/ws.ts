type Callback = (msg: string) => void;

let delay = 1;

class WS {
  private url: string;
  private ws: WebSocket | undefined;
  private listeners: { [key: string]: Callback[] };
  private instanceId: string | undefined;

  constructor (url: string) {
    this.url = url;
    this.listeners = {};
  }

  init(instanceId: string) {
    this.instanceId = instanceId;
    this._init();
  }

  _init() {
    this.close();

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

const url = process.env.API_BASE_URL?.replace(/^http:\/\//, "ws://").replace(/^https:\/\//, "wss://");
const ws: WS = new WS(`${url}`);

export default ws;
