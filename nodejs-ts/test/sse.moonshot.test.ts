import { test } from "vitest";
// import { SSE } from 'sse.js';
// const http = require('http');
const https = require('https');
// const axios = require('axios');

const querystring = require('querystring');


test("sse-post-moonshot", async () => {
  // https://api.moonshot.cn/v1/chat/completions
  const options = {
    protocol: 'https:',
    hostname: 'api.moonshot.cn',
    // port: 8500,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Accept': 'text/event-stream',
      'Authorization': 'Bearer sk-u7MO1QfCXHcFTXYuj6QnlZU58FW2SZKvHVVsaB9LxrLpzUkS',
      // 'Content-Length': postBody.length
    }
  };

  const req = https.request(options, (res) => {
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

  const postBody = JSON.stringify({
    "model": "moonshot-v1-8k",
    "messages": [
        {
            "role": "system",
            "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
        },
        { "role": "user", "content": "你好，我叫李雷，1+1等于多少？" }
    ],
    "temperature": 0.3,
    "stream": true
  });
  // 发送报文
  req.write(postBody);

  // 发送请求  
  req.end();

  await sleep(30)
}, 120 * 1000)



async function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
