import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api')
  async api() {
    return this.appService.PromiseApi();
  }

  @Get('get')
  async request() {
    const data = await this.appService.getApi();
    return data;
  }

  @Post('post')
  async post() {
    const data = await this.appService.postApi();
    return data;
  }
}
