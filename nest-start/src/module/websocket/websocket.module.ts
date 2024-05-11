import { Module } from '@nestjs/common';
import { ChatWebSocketGateway } from './websocket.gateway';

@Module({
  providers: [ChatWebSocketGateway],
})
export class WebsocketModule {}
