import { Module } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { CatModule } from './module/cat/cat.module';
import config from './config/config';

@Module({
  imports: [MongooseModule.forRoot(config.mongodbUrl), UserModule, CatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareBuilder) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
