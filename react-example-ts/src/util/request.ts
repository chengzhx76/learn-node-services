import axios from 'axios';

const instance = axios.create({
  baseURL: '/', // 基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  // 其他配置...
});

instance.interceptors.request.use(
  config => {
    // 可以在这里添加例如token等请求头
    config.headers['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTgxODU3ODQsImV4cCI6MTcxODI3MjE4NH0.s7XS_2yhjCzN27BcG8sv3Ql8b62-nL_vbhOvQTCbR4A`;
    return config;
  },
  error => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    // 对响应数据做处理，例如只返回data部分
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;