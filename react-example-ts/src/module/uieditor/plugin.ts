import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { Location } from 'slate'
import { IExtendConfig } from '../utils/interface'

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}

const lineMap = new Map<number, string>()

const commkeys = ['旁白:', '旁白：', '黑屏文字:', '黑屏文字：']

function containColon(text:string) {
  return text.indexOf(':') !== -1 || text.indexOf('：') !== -1
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法
  
  console.log('uieditor.withUiEditor');


  const { insertText, isInline, isVoid, normalizeNode, insertBreak, insertNode, deleteBackward } = editor
  const newEditor = editor

  newEditor.insertText = t => {
    
    // const { addExpression, putUiEditorText } = getUiEditorConfig(editor)
    const extend = getUiEditorConfig(editor)

    if (t === ':' || t === '：') { 
      if (extend.addExpression) extend.addExpression(newEditor)
    }
    insertText(t)

    if (extend && extend.putUiEditorText) { 
      extend.putUiEditorText();
    }
  }

  newEditor.insertBreak = () => { 
    insertBreak();
    // const { putUiEditorText } = getUiEditorConfig(editor)
    const extend = getUiEditorConfig(editor)
    if (extend && extend.putUiEditorText) { 
      extend.putUiEditorText();
    }
  }

  newEditor.insertNode = (node) => {
    return insertNode(node);
  }
  
  newEditor.deleteBackward = (unit) => { 
    const { selection } = editor;
    if (!selection) {
      deleteBackward(unit);
      return
    }
    const _node = SlateNode.get(editor, selection.anchor.path);
    if (_node) {
    }
    deleteBackward(unit);
    
    const line = selection.anchor.path[0]
    if (SlateNode.has(editor, selection.anchor.path)) {
      const node = SlateNode.get(editor, selection.anchor.path);
      if (node) {
        const text = SlateNode.string(node);
        if (text) {
          const isInclude = commkeys.some(commkey => text.includes(commkey))
          if (isInclude) {
            return
          }
          const preText = lineMap.get(line)
          if (preText) {
            if (containColon(preText) && !containColon(text)) {
              SlateTransforms.deselect(editor); // 确保没有选中内容
              removeNode('uiexpression', newEditor)
              removeNode('uiplay', newEditor)
              SlateTransforms.select(editor, selection); // 恢复之前的选区
            }
          }
          lineMap.set(line, text)
        }
      }
    }

    // const { putUiEditorText } = getUiEditorConfig(editor)
    const extend = getUiEditorConfig(editor)
    if (extend && extend.putUiEditorText) { 
      extend.putUiEditorText();
    }
  }

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

const removeNode = (nodeType: string, editor: IDomEditor) => {
  let removePath: Location = []
  let line = 0
  if (editor && editor.selection) {
    line = editor.selection.anchor.path[0]
  }
  for (const [node, path] of SlateNode.descendants(editor, { from: [line] })) {
      const type = DomEditor.getNodeType(node);
      if (type === nodeType) {
        removePath = path
      }
  }
  if (removePath.length > 0) {
    SlateTransforms.removeNodes(editor, { at: removePath });
  }
}
export default withUiEditor