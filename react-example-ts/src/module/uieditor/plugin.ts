import { IDomEditor, DomEditor, SlateTransforms } from '@wangeditor/editor'
import { UiEditorElement } from './custom-types'
import { IExtendConfig } from './interface'

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { uiEditotConfig } = EXTEND_CONF as IExtendConfig
  return uiEditotConfig
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { insertText, isInline, isVoid } = editor
  const newEditor = editor

  newEditor.insertText = t => {
    
    // mention 相关配置
    const { addExpression, addPay } = getUiEditorConfig(newEditor)

    if (t === ':') { 
      if (addExpression) addExpression(newEditor)
      if (addPay) addPay(newEditor)
    }
    insertText(t)
  }

 // 重写 isInline
  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'uieditor') {
      return true
    }

    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'uieditor') {
      return true
    }

    return isVoid(elem)
  }


  return editor
}

export default withUiEditor