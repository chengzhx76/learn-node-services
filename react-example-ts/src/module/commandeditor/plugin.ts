import { IDomEditor } from '@wangeditor/editor'
import { IExtendConfig } from './interface'

function getCommandEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { commandEditotConfig } = EXTEND_CONF as IExtendConfig
  return commandEditotConfig
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { insertText, deleteBackward, insertBreak } = editor;
  const newEditor = editor;

  newEditor.insertText = t => {
    insertText(t);
    const { putEditorText } = getCommandEditorConfig(newEditor);
    if (putEditorText) { 
      putEditorText();
    }
  };

  newEditor.deleteBackward = (unit) => {
    deleteBackward(unit);
    const { putEditorText } = getCommandEditorConfig(newEditor);
    if (putEditorText) {
      putEditorText();
    }
  };

  newEditor.insertBreak = () => {
    insertBreak();
    const { putEditorText } = getCommandEditorConfig(newEditor);
    if (putEditorText) { 
      putEditorText();
    }
  };

  return editor;
}

export default withUiEditor