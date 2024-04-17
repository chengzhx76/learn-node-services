import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {

    console.log("pwd=> ", process.cwd());

    return 'Hello World!';
  }

  async PromiseApi(): Promise<any> {
    return await new Promise(async (resolve) => {
      await sleep(1000);
      resolve('Hi');
    });
  }

  async getApi(): Promise<any> {
    try {
      const response = await axios.get('https://chengzhx76.cn/pinche-test/ping');
      await sleep(5000);
      return response.data;
    } catch (error) {
      // 处理错误，例如记录日志或抛出异常
      console.error('Error fetching external data:', error);
      throw error;
    }
  }
  
  async postApi(): Promise<any> {
    try {
      const response = await axios.post('https://chengzhx76.cn/pinche-test/ping');
      await sleep(5000);
      return response.data;
    } catch (error) {
      // 处理错误，例如记录日志或抛出异常
      console.error('Error fetching external data:', error);
      throw error;
    }
  }
}


function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
}
