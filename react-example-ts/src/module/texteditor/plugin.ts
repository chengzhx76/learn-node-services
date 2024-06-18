import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { IExtendConfig } from '../utils/interface'
import { TextCommandPanelElement } from "./custom-types";

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}

const replaceLineText = (editor: IDomEditor, lineIndex:number, newText:string) => {
  const path = [lineIndex, 2];
  SlateTransforms.removeNodes(editor, { at: path });
  SlateTransforms.insertText(editor, newText, { at: path });
};

const commands = ['旁白:', '立绘图片:', '结束游戏']
const commandRegx = new RegExp(commands.join("|"), "gi");

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { isInline, isVoid, insertBreak, insertText } = editor
  const newEditor = editor

  function insertTextCommand() {
    if (editor) {
      editor.restoreSelection();
      const commandNode: TextCommandPanelElement = {
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
      SlateTransforms.insertNodes(editor, commandNode, { at: editor.selection?.anchor.path });
    }
  }

  newEditor.insertBreak = () => { 
    insertBreak();
    setTimeout(() => { 
      insertTextCommand()
    }, 100)
  }


  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'textcommand' || type === 'textlabel') {
      return true
    }
    return isInline(elem)
  }

  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'textcommand' || type === 'textlabel') {
      return true
    }
    return isVoid(elem)
  }
  return editor
}

export default withUiEditor