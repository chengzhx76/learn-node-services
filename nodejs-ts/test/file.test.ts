import { test } from "vitest";
import * as fs from "fs/promises";

test("file-copy-test", async () => {
  // let src = "D:\\test",
  //   dest = "D:\\test1";
  let src =
      "D:\\web_project\\umf-webGAL\\webgal-neta-editor\\packages\\terre2\\assets\\templates\\WebGAL_Template\\game",
    dest =
      "D:\\web_project\\umf-webGAL\\webgal-neta-editor\\packages\\terre2\\public\\games\\6629fd12c4b6cfbea37592ed\\game\\新的游戏1";

  fs.cp(decodeURI(src), decodeURI(dest), { recursive: true })
    .then((res) => {
      console.log("res--> ", res);
    })
    .catch((err) => {
      console.log("err--> ", err);
    });
  await sleep(3000);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
