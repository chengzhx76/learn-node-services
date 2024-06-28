import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { Location } from 'slate'
import { IExtendConfig } from '../utils/interface'
import { removeEditorNode } from '../utils'

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}

// const lineMap = new Map<number, string>()

const commkeys = ['旁白:', '旁白：', '黑屏文字:', '黑屏文字：']

function containColon(text:string) {
  return text.indexOf(':') !== -1 || text.indexOf('：') !== -1
}

function monitorRemoveNode(editor: IDomEditor) {
   const { selection } = editor;
    if (!selection) {
      return;
    }
  const linePath = selection.anchor.path;
  const node = SlateNode.get(editor, linePath);
  if (!node) {
    return;
  }
  const lineText = SlateNode.string(node);
  if (lineText) {
    const isInclude = commkeys.some(commkey => lineText.includes(commkey));
    if (isInclude) {
      return
    }
    /* const preText = lineMap.get(linePath[0]);
    if (preText && containColon(preText) && !containColon(lineText)) {
      // SlateTransforms.deselect(editor); // 确保没有选中内容
      removeEditorNode('uiexpression', newEditor);
      // SlateTransforms.select(editor, selection); // 恢复之前的选区
    }
    lineMap.set(linePath[0], lineText); */
    if (containColon(lineText)) {
      return
    }
    removeEditorNode('uiexpression', editor);
  } else {
    removeEditorNode('uiplay', editor);
  }
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法
  
  const { insertText, deleteBackward, isInline, isVoid } = editor
  const newEditor = editor

  newEditor.insertText = t => {
    // @ts-ignore
    const editorMode = window['editorMode']
    if (editorMode === 'text') {
      insertText(t)
      return
    }
    const extend = getUiEditorConfig(editor)
    if (extend && extend.editorType === 'ui' && extend.addExpression) {
      extend.addExpression(newEditor, t)
    }
    insertText(t)
  }

  
  newEditor.deleteBackward = (unit) => {
    // @ts-ignore
    const editorMode = window['editorMode']
    if (editorMode === 'text') {
      deleteBackward(unit);
      return
    }
    const extend = getUiEditorConfig(editor);
    if (extend && extend.editorType === 'ui') {
      setTimeout(() => { 
        monitorRemoveNode(editor)
        extend.checkExpression(editor)
      }, 500)
    }
    deleteBackward(unit);
  };

  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'uiexpression' || type === 'uiplay') {
      return true
    }
    return isInline(elem)
  }

  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'uiexpression' || type === 'uiplay') {
      return true
    }
    return isVoid(elem)
  }
  return editor
}

export default withUiEditor