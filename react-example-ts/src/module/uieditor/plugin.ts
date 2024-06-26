import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { Location } from 'slate'
import { IExtendConfig } from '../utils/interface'
import { removeEditorNode } from '../utils'

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
  
  const { insertText, isInline, isVoid, insertBreak, insertNode, deleteBackward } = editor
  const newEditor = editor

  newEditor.insertText = t => {

    /* const { selection } = editor;
    if (!selection) {
      return;
    }
    
    if (SlateNode.has(editor, selection.anchor.path)) { 
      const node = SlateNode.get(editor, selection.anchor.path);
      if (node) {
        const text = SlateNode.string(node);
        if (text) {
          const isInclude = commkeys.some(commkey => (text+t).includes(commkey));
          if (isInclude) {
            insertText(t);
            return;
          }
        }
      }
    } */

    const extend = getUiEditorConfig(editor)
    if (extend.addExpression) extend.addExpression(newEditor, t)

    insertText(t)
  }

  newEditor.insertBreak = () => { 
    insertBreak();
  }

  newEditor.insertNode = (node) => {
    return insertNode(node);
  }
  
  newEditor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (!selection) {
      deleteBackward(unit);
      return;
    }
    deleteBackward(unit);

    const extend = getUiEditorConfig(editor);
    if (extend.editorType && extend.editorType === 'ui' && SlateNode.has(editor, selection.anchor.path)) {
      const node = SlateNode.get(editor, selection.anchor.path);
      if (node) {
        const text = SlateNode.string(node);
        if (text) {
          const isInclude = commkeys.some(commkey => text.includes(commkey));
          if (isInclude) {
            return;
          }
          const line = selection.anchor.path[0];
          const preText = lineMap.get(line);
          if (preText) {
            if (containColon(preText) && !containColon(text)) {
              SlateTransforms.deselect(editor); // 确保没有选中内容
              removeEditorNode('uiexpression', newEditor);
              SlateTransforms.select(editor, selection); // 恢复之前的选区
              /* SlateTransforms.move(editor, {
                unit: 'line',
                edge: 'end',
                reverse: false,
              }); */
              // const end = SlateEditor.end(editor, []);
              // SlateTransforms.select(editor, end);
              // editor.select(end);
            }
          }
          lineMap.set(line, text);
        } else {
          // SlateTransforms.deselect(editor);
          removeEditorNode('uiplay', newEditor);
          // SlateTransforms.select(editor, selection);
        }
      }
    }
    /* const { postScenesText } = getUiEditorConfig(newEditor);
    if (postScenesText) {
      postScenesText();
    } */
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