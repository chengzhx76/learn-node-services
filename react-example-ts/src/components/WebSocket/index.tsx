import React, { useEffect, useState, useRef } from "react";
import WebSocketConnection from "../../util/WebSocket";

const MyWebSocketComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const wsConnectionRef = useRef<WebSocketConnection | null>(null);

  useEffect(() => {
    console.log("=======useEffect===========");
    messageSocket();
    return () => {
      if (wsConnectionRef.current) {
        console.log("=======wsConnectionRef.current.close()===========");
        wsConnectionRef.current.close();
      }
    };
  }, []);

  const messageSocket = () => {
    const wsConnection = new WebSocketConnection(
      "ws://localhost:3001/api/test-ws",
      "1111"
    );

    wsConnectionRef.current = wsConnection;
    // setMsgWebSocket(wsConnection);

    wsConnection.on("open", (event) => {
      console.log("socket.event已连接");
    });

    wsConnection.on("message", (e) => {
      console.log("messageSocket:", e.data);
    });
  };

  const sendMessage = () => {
    if (wsConnectionRef.current) {
      const msgEvent = JSON.stringify({
        event: "message",
        data: message,
      });
      wsConnectionRef.current.send(msgEvent);
    }
  };

  return (
    <div>
      <h1>WebSocket Component</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default MyWebSocketComponent;
