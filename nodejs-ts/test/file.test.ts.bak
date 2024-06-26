import { test } from "vitest";
import * as fs from "fs/promises";
const fss = require('fs')
import path from 'path';
// import glob = require('glob');
// import { glob } from 'glob'
const {
  glob,
} = require('glob')

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

test("file-read-test", async () => {
  
  const jsfiles = await glob('../*.js', { ignore: 'node_modules/**' })
  
  await sleep(3000);
});

test("file-read2-test", async () => {
  
  const files = await readFile2()

  console.log('==》 Found jsfiles:', files);
  
  await sleep(3000);
});

async function readFile2() {
  const fileNames: string[] = [];
  const files = await glob('./res/*.scss', { })
  console.log('==》 filesfilesfilesfilesfiles:', files);
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = path.basename(file);
    // fss.unlinkSync(file);
    console.log(fileName + ' was deleted');
    fileNames.push(fileName);
  }
  return files
}

async function readFile() {

  // const fileNames: string[] = [];
  await glob('D:\\web_project\\learn-node-services\\nodejs-ts\\test\\res\\*', {}, (err, files) => {
    if (err) {
      console.error('Error finding files:', err);
      return;
    }
    console.log('Found files:', files);
    /* for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = path.basename(file);
      console.log(fileName + ' was deleted');
      fileNames.push(fileName);
    } */
  })
  // return fileNames;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


