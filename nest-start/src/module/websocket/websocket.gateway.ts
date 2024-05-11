import {
  // ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

/*
  ws://localhost:3000/api/ws
  {"event":"message","data":"hi"}
*/

@WebSocketGateway({ path: '/api/ws', transports: 'websocket' })
export class ChatWebSocketGateway {
  @WebSocketServer()
  private server: Server;

  private connectionList: WebSocket[] = [];

  afterInit(server: Server) {
    console.log('ChatWebSocketGateway.afterInit==> ');
    this.server = server;
  }

  handleConnection(client: WebSocket) {
    console.log('ChatWebSocketGateway.handleConnection==> ');
    this.connectionList.push(client);
  }

  handleDisconnect(client: WebSocket) {
    console.log('ChatWebSocketGateway.handleDisconnect==> ');
    const index = this.connectionList.indexOf(client);
    if (index !== -1) {
      this.connectionList.splice(index, 1);
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string /* , @ConnectedSocket() client: WebSocket */,
  ): void {
    console.log('ChatWebSocketGateway.handleMessage==> ');
    this.connectionList.forEach((socket) => {
      const sendData = JSON.stringify({
        event: 'message',
        data: {
          send: data,
          att: 'to',
        },
      });
      socket.send(sendData);
    });
  }
  @SubscribeMessage('')
  handleAllMessage(
    @MessageBody() data: string /* , @ConnectedSocket() client: WebSocket */,
  ): void {
    console.log('ChatWebSocketGateway.handleAllMessage==> ');
    this.connectionList.forEach((socket) => {
      const sendData = JSON.stringify({
        event: 'message',
        data,
      });
      socket.send(sendData);
    });
  }
}
