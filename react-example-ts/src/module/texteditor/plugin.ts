import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { Location } from 'slate'
import { IExtendConfig } from './interface'
import { TextCommandElement } from "./custom-types";

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { textEditotConfig } = EXTEND_CONF as IExtendConfig
  return textEditotConfig
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { isInline, isVoid, insertBreak, selection } = editor
  const newEditor = editor

function insertTextCommand() {
    const commandNode: TextCommandElement = {
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

    if (editor) {
      editor.restoreSelection(); // 恢复选区
      /* SlateTransforms.insertNodes(editor, commandNode, {
        at: editor.selection?.anchor.path,
      }); */
      SlateTransforms.insertNodes(editor, commandNode, { at: editor.selection?.anchor.path });
    }
  }

  newEditor.insertBreak = () => { 
    const uiexpressionNode = DomEditor.getSelectedTextNode(newEditor);
    console.log('insertBreak.uiexpressionNode===> ', uiexpressionNode);
    insertBreak();
    setTimeout(() => { 
      insertTextCommand()
    }, 100)
  }

  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'textcommand') {
      return true
    }
    return isInline(elem)
  }

  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'textcommand') {
      return true
    }
    return isVoid(elem)
  }
  return editor
}

export default withUiEditor