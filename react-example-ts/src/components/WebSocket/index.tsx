import React, { useEffect, useState, useRef } from 'react';
import WebSocketConnection from '../../util/WebSocket';

const MyWebSocketComponent: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const wsConnectionRef = useRef<WebSocketConnection | null>(null);

  useEffect(() => {
    const wsConnection = new WebSocketConnection('ws://localhost:3001/api/ws');
    wsConnectionRef.current = wsConnection;

    // Close WebSocket when component unmounts
    return () => {
      if (wsConnectionRef.current) {
        wsConnectionRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (wsConnectionRef.current) {
      wsConnectionRef.current.send(message);
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
