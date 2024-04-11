import { test } from "vitest";
import { SSE } from 'sse.js';
const http = require('http');
const https = require('https');
const axios = require('axios');

const querystring = require('querystring');

// test("sse-test", async () => {
// console.log("哈哈哈哈");

// const source = new SSE('http://10.10.77.119:8500/v1/chat/completions', {
//   payload: 'Hello, world!',
//   method: 'POST',
// });
// source.addEventListener('message', (e) => {
//   const payload = JSON.parse(e.data);
//   console.log(payload);
// });
// // ... later on
// source.stream();
// await sleep(150000)
// });

test("sse-test2", async () => {

  // Options for making HTTP requests
  // https://chengzhx76.cn/pinche-test/ping
  const options = {
    hostname: 'chengzhx76.cn',
    port: 443,
    path: '/pinche-test/ping',
    method: 'GET'
  };

  // Make multiple HTTP requests
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
      console.log('chunk--> ', chunk);
    });
    res.on('end', () => {
      console.log('end--> ', data); // Handle response data
    });
  });

  req.on('error', (error) => {
    console.error(error); // Handle errors
  });

  req.end();
  await sleep(10)
})

test("sse-test3", async () => {
  axios.get('https://chengzhx76.cn/pinche-test/ping').then(resp => {
    console.log(resp.data);
  })
  await sleep(10)
})

// http://127.0.0.1:8080/events?stream=test
test("sse-get", async () => {

  const options = {
    hostname: '127.0.0.1',
    port: 8080, // 或者使用 443 对于 HTTPS  
    path: '/events?stream=test',
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream',
      // 其他可能的请求头，如身份验证信息等  
    }
  };

  const req = http.request(options, (res) => {
    res.setEncoding('utf8'); // 设置响应编码为utf8  

    // 监听'data'事件以接收SSE消息  
    res.on('data', (chunk) => {
      // chunk 是服务器发送的SSE消息，通常每行一个事件  
      // SSE消息以 "data: " 开头，后面跟着数据内容，可能以 "\n\n" 结尾  
      const lines = chunk.trim().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6); // 去除 "data: " 前缀  
          console.log('Received SSE data:', data);
          // 在这里处理接收到的数据，例如更新UI等  
        } else if (line === '') {
          // 空行表示一个事件的结束  
        } else {
          // 其他类型的行，例如 'event: eventname'，'id: 123'，'retry: 1000' 等  
          console.log('SSE line:', line);
        }
      }
    });

    // 监听'end'事件以知道何时SSE连接结束  
    res.on('end', () => {
      console.log('SSE connection closed.');
    });

    // 监听'error'事件以处理请求过程中的错误  
    res.on('error', (error) => {
      console.error('SSE request error:', error);
    });
  });

  req.on('error', (error) => {
    console.error('SSE request problem:', error.message);
  });

  // 发送请求  
  req.end();
  await sleep(60)
}, 70 * 1000)



test("sse-post", async () => {
  // const postBody = querystring.stringify({
  //   // 你的 POST 数据  
  //   "model": "chatglm3-6b",
  //   "messages": {
  //     "role": "user",
  //     "content": "给我讲个故事吧"
  //   },
  //   "stream": true
  // });
  // http://10.10.77.119:8500/v1/chat/completions
  const options = {
    hostname: '10.10.77.119',
    port: 8500,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Accept': 'text/event-stream',
      // 'Content-Length': postBody.length
    }
  };

  const req = http.request(options, (res) => {
    res.setEncoding('utf8'); // 设置响应编码为utf8  

    // 监听'data'事件以接收SSE消息  
    res.on('data', (chunk) => {
      // chunk 是服务器发送的SSE消息，通常每行一个事件  
      // SSE消息以 "data: " 开头，后面跟着数据内容，可能以 "\n\n" 结尾  
      const lines = chunk.trim().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6); // 去除 "data: " 前缀  
          console.log('Received SSE data:', data);
          // 在这里处理接收到的数据，例如更新UI等  
        } else if (line === '') {
          // 空行表示一个事件的结束  
        } else {
          // 其他类型的行，例如 'event: eventname'，'id: 123'，'retry: 1000' 等  
          console.log('SSE line:', line);
        }
      }
    });

    // 监听'end'事件以知道何时SSE连接结束  
    res.on('end', () => {
      console.log('SSE connection closed.');
    });

    // 监听'error'事件以处理请求过程中的错误  
    res.on('error', (error) => {
      console.error('SSE request error:', error);
    });
  });

  req.on('error', (error) => {
    console.error('SSE request problem:', error.message);
  });

  // 发送报文
  req.write('{ "model": "chatglm3-6b", "messages": [{"role": "user", "content": "介绍一下你的能力"}], "stream": true}');

  // 发送请求  
  req.end();

  await sleep(110)
}, 120 * 1000)



async function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
