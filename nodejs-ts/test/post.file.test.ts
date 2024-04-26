import { test } from "vitest";
import http from "http";
import FormData from "form-data";
import * as fs from "fs/promises";
const request = require("request");

test("post-file", async () => {
  const original_ref = {
    filename: "target.png",
    subfolder: "clipspace",
    type: "input",
  };
  const formData = new FormData();

  const buffer = await fs.readFile(
    decodeURI(
      "D:\\web_project\\umf-webGAL\\webgal-neta-editor\\packages\\terre2\\assets\\templates\\WebGAL_Template\\game\\background\\bg.png"
    )
  );
  formData.append("image", buffer);
  formData.append("type", "input");
  formData.append("subfolder", "clipspace");
  // form.append('original_ref', "{\"filename\":\"target.png\",\"subfolder\":\"clipspace\",\"type\":\"input\"}");
  formData.append("original_ref", JSON.stringify(original_ref));

  console.log("哈哈哈哈");

  const options = {
    protocol: "http:",
    hostname: "10.10.77.242:8186",
    port: 80,
    path: "/upload/mask",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const req = http
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (err) => {
      console.log("Error: ", err.message);
    });

  req.write(formData);
  req.end();
});

test("post-file2", async () => {
  const buffer = await fs.readFile(decodeURI("D:\\barcode.png"));

  var req = request.post(
    "http://10.10.77.242:8186/upload/mask",
    function (err, resp, body) {
      if (err) {
        console.log("Error!");
      } else {
        console.log("body===> " + body);
        console.log("resp===> " + JSON.stringify(resp));
      }
    }
  );

  var form = req.form();
  const original_ref = {
    filename: "target.png",
    subfolder: "clipspace",
    type: "input",
  };

  form.append("image", buffer, {
    filename: "barcode.png",
    contentType: "image/png",
  });
  // form.append("image", buffer);
  form.append("type", "input");
  form.append("subfolder", "clipspace");
  // form.append("original_ref", JSON.stringify(original_ref));
  form.append(
    "original_ref",
    '{"filename":"target.png","subfolder":"clipspace","type":"input"}'
  );
  await sleep(5000);
}, 6000);

test("post-file3", async () => {
  const buffer = await fs.readFile(
    decodeURI(
      "D:\\web_project\\umf-webGAL\\webgal-neta-editor\\packages\\terre2\\assets\\templates\\WebGAL_Template\\game\\background\\bg.png"
    )
  );
  const formData = {
    custom_file: {
      value: buffer,
      options: {
        filename: "topsecret.jpg",
        contentType: "image/jpeg",
      },
    },
  };

  request.post(
    { url: "http://10.10.77.242:8186/upload/mask", formData: formData },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error("upload failed:", err);
      }
      console.log("Upload successful!  Server responded with:", body);
    }
  );
  await sleep(5000);
}, 6000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
