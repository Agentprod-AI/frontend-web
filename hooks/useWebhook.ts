/* eslint-disable no-console */

import { useEffect, useState } from "react";

// const useWebSocket = (url: string) => {
//   const [socket, setSocket] = useState<WebSocket | null>(null);

//   useEffect(() => {
//     if (!url) {
//       console.log("WebSocket URL not provided");
//       return undefined;
//     }

//     const ws = new WebSocket(url);

//     ws.onopen = () => {
//       console.log("WebSocket Connected");
//       setSocket(ws); // Set socket after confirming connection is open
//     };

//     ws.onmessage = (event) => console.log("WebSocket Message:", event.data);

//     ws.onerror = (error) => console.error("WebSocket Error:", error);

//     ws.onclose = (event) => {
//       console.error(
//         "WebSocket closed. Reason:",
//         event.reason,
//         "Code:",
//         event.code
//       );
//       setSocket(null); // Reset socket state on close
//     };

//     return () => {
//       console.log("Cleaning up WebSocket");
//       ws.close();
//     };
//   }, [url]); // Ensure URL is stable

//   return { socket };
// };

// export default useWebSocket;

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log("WebSocket Message:", event.data);
      const message = JSON.parse(event.data);
      setRecentActivities((prevActivities) => [
        { client: message.client, body: message.body },
        ...prevActivities.slice(0, 4), // Keep only the last 5 activities
      ]);
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onclose = (event) => {
      console.error(
        "WebSocket closed. Reason:",
        event.reason,
        "Code:",
        event.code
      );
      setSocket(null);
    };

    return () => {
      console.log("Cleaning up WebSocket");
      ws.close();
    };
  }, [url]);

  return { socket, recentActivities };
};

export default useWebSocket;
