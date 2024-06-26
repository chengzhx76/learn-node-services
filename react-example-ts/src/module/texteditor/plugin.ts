import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { IExtendConfig } from '../utils/interface'
import { TextCommandPanelElement } from "./custom-types";
import { commands } from "./command";

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}
function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { isInline, isVoid, insertBreak, insertText } = editor
  const newEditor = editor

  function insertTextCommand() {
    if (editor) {
      editor.restoreSelection();
      const commandNode: TextCommandPanelElement = {
        type: "textcommand",
        list: commands,
        children: [{ text: "" }],
      };
      SlateTransforms.insertNodes(editor, commandNode, { at: editor.selection?.anchor.path });
    }
  }

  newEditor.insertBreak = () => { 
    setTimeout(() => { 
      insertTextCommand()
    }, 100)
    insertBreak();
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