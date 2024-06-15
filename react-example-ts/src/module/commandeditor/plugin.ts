import { IDomEditor } from '@wangeditor/editor'
import { IExtendConfig } from '../utils/interface'

function getCommandEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { insertText, deleteBackward, insertBreak } = editor;
  const newEditor = editor;

  newEditor.insertText = t => {
    insertText(t);
    // const { putTextEditorText } = getCommandEditorConfig(newEditor);
    /* const extend = getCommandEditorConfig(newEditor);
    if (extend && extend.putTextEditorText) { 
      extend.putTextEditorText();
    } */
  };

  newEditor.deleteBackward = (unit) => {
    deleteBackward(unit);
    // const { putTextEditorText } = getCommandEditorConfig(newEditor);
    /* const extend = getCommandEditorConfig(newEditor);
    if (extend && extend.putTextEditorText) {
      extend.putTextEditorText();
    } */
  };

  newEditor.insertBreak = () => {
    insertBreak();
    // const { putTextEditorText } = getCommandEditorConfig(newEditor);
    /* const extend = getCommandEditorConfig(newEditor);
    if (extend && extend.putTextEditorText) { 
      extend.putTextEditorText();
    } */
  };

  return editor;
}

export default withUiEditor