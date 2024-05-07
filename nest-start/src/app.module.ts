import { join } from 'path';
import { Module } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { CatModule } from './module/cat/cat.module';
import { ChatModule } from './module/websocket/websocket.module';
import config from './config/config';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodbUrl),
    UserModule,
    CatModule,
    ChatModule,
    // 静态文件服务：游戏与编辑器静态资源文件
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'static'),
      serveRoot: '/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareBuilder) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
