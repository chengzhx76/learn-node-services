import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { MiddlewareBuilder } from '@nestjs/core';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareBuilder){
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
