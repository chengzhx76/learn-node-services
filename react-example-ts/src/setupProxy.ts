import { createProxyMiddleware } from "http-proxy-middleware";
import { Application } from "express";


module.exports = function(app: Application) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://10.10.77.121:3001',
      changeOrigin: true,
    })
  );

  // 你可以在这里添加更多的代理配置
};
