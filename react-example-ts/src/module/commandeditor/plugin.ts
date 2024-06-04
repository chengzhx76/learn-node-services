import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { IExtendConfig } from './interface'

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { commandEditotConfig } = EXTEND_CONF as IExtendConfig
  return commandEditotConfig
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { isInline, isVoid, insertBreak, selection } = editor
  const newEditor = editor

  newEditor.insertBreak = () => { 
    insertBreak();
  }

  return editor
}

export default withUiEditor