import { TextCommandPanelElement } from "./custom-types";
export const commandPanelNode: TextCommandPanelElement = {
  type: "textcommand",
  list: [
    {
      label: "插入旁白",
      command: "旁白:",
    },
    {
      label: "插入立绘图片",
      command: "立绘图片:",
    },
    {
      label: "结束游戏",
      command: "结束游戏",
    },
  ],
  children: [{ text: "" }],
};