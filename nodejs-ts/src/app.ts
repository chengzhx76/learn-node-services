import express, { Request, Response } from "express";
const url = require("url");
const querystring = require("querystring");
import { Cache } from "./cache";

const app = express();

const cacheReqId = new Cache<string, string>(10, 2);

/*
  http://localhost:3002/?req=1111&name=cheng
  http://localhost:3002/get?req=1111
*/

app.get("/", (req: Request, res: Response) => {
  const parsedUrl = url.parse(req.url, true);

  const reqId = parsedUrl.query.req;
  const name = parsedUrl.query.name;
  cacheReqId.set(reqId, name);

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

app.get("/get", (req: Request, res: Response) => {
  const parsedUrl = url.parse(req.url, true);

  const reqId = parsedUrl.query.req;
  const name = cacheReqId.get(reqId);

  console.log("name====> ", name);

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

// 监听端口
const port = 3002;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
