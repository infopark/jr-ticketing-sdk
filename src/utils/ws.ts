type Callback = (msg: string) => void;

let delay = 1;

class WS {
  private url: string;
  private ws: WebSocket | undefined;
  private listeners: { [key: string]: Callback[] };
  private instanceId: string | undefined;
  private timer: NodeJS.Timer | undefined;

  constructor (url: string) {
    this.url = url;
    this.listeners = {};
  }

  init(instanceId: string) {
    this.instanceId = instanceId;
    this._init();
  }

  async _init() {
    this.close();

    if (!this.timer) {
      this.timer = setInterval(() => {
        Object.values(this.listeners).forEach((callbacks) => {
          callbacks.forEach((callback) => {
            callback("dummy");
          });
        });
      }, 1*60*1000);
    }

    const portalUrl = `${window.location.protocol}//${window.location.host}`;
    const res = await fetch(`${process.env.JR_REST_API_ENDPOINT}/iam/${this.instanceId}/short_term_token?origin=${encodeURIComponent(portalUrl)}`);
    const { access_token } = await res.json();

    const ws = new WebSocket(`${this.url}/ticketing/${this.instanceId}/${access_token}`);

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

const url = process.env.WS_BASE_URL?.replace(/^http:\/\//, "ws://").replace(/^https:\/\//, "wss://");
const ws: WS = new WS(`${url}`);

export default ws;
