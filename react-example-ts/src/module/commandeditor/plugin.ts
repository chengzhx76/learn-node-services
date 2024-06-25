import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { Path } from 'slate'
import { IExtendConfig } from '../utils/interface'
import { TextCommandPanelElement } from "./custom-types";
import { commands } from './command'
import { moveCommandPanel } from './dom'

function getTextEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { isInline, isVoid, insertBreak, insertNode, deleteBackward, insertData } = editor
  const newEditor = editor

  function insertTextCommand() {
    if (editor && editor.selection) {
      const linePath = editor.selection.anchor.path
      editor.restoreSelection();
      const commandNode: TextCommandPanelElement = {
        type: "textcommand",
        list: commands,
        children: [{ text: "" }],
      };
      SlateTransforms.insertNodes(editor, commandNode, { at: linePath });
      setTimeout(() => { 
        moveCommandPanel(linePath[0])
      }, 300)
    }
  }

  newEditor.insertBreak = () => { 
    insertBreak();
    const extend = getTextEditorConfig(editor);
    if (extend.editorType && extend.editorType === 'text') {
      setTimeout(() => { 
        insertTextCommand()
      }, 100)
    }
  }

  newEditor.deleteBackward = unit => {
    if (editor && editor.selection) { 
      const linePath = editor.selection.anchor.path
      const line = linePath[0]
      const lineNode = SlateNode.get(editor, linePath);
      const lineText = SlateNode.string(lineNode);
      if (lineText.length !== 0) {
        deleteBackward(unit)
      } else {
        if (line !== 0) {
          SlateTransforms.removeNodes(editor, { at: [line] });
        }
      }
    }
  }

  newEditor.insertNode = (node) => {
    return insertNode(node);
  }

  /* newEditor.insertData = (data: DataTransfer) => {
    const codeNode = DomEditor.getSelectedNodeByType(newEditor, 'code')
    if (codeNode == null) {
      insertData(data) // 执行默认的 insertData
      return
    }

    // 获取文本，并插入到代码块
    const text = data.getData('text/plain')
    // Editor.insertText(newEditor, text)
  } */


  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'textcommand' || type === 'textplay') {
      return true
    }
    return isInline(elem)
  }

  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'textcommand' || type === 'textplay') {
      return true
    }
    return isVoid(elem)
  }
  return editor
}

export default withUiEditor