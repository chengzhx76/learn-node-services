import { TextCommandPanelElement } from "./custom-types";

export const commands = [
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
]

export const commandPanelNode: TextCommandPanelElement = {
  type: "textcommand",
  list: commands,
  children: [{ text: "" }],
};