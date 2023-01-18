import { useEffect, useState } from "react";

import ws from "./ws";

export default function useWS(...channel: string[]): unknown {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    const unsubscribe = ws.subscribe(...channel, (msg: string) => {
      setData({
        msg,
        time: new Date()
      });
    });

    return () => unsubscribe();
  }, channel);

  return data;
}
