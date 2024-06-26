import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { Location } from 'slate'
export const removeEditorNode = (nodeType: string, editor: IDomEditor) => {
  let removePath: Location = []
  let line = 0
  if (editor && editor.selection) {
    line = editor.selection.anchor.path[0]
  }

  const descendantNodes = SlateNode.descendants(editor, {
    from: [line],
    to: [line],
    reverse: true,
    pass: ([node]) => DomEditor.checkNodeType(node, nodeType),
  });

  for (const [node, path] of descendantNodes) {
      if (DomEditor.checkNodeType(node, nodeType)) {
        removePath = path
      }
  }
  if (removePath.length > 0) {
    SlateTransforms.removeNodes(editor, { at: removePath });
  }
}

export const getEditorNode = (nodeType: string, editor: IDomEditor) => {
  if (editor && editor.selection) {
    const { selection } = editor;
    const linePath = selection.anchor.path;

    const descendantNodes = SlateNode.descendants(editor, {
      from: [linePath[0]],
      to: [linePath[0]],
      reverse: true,
      pass: ([node]) => DomEditor.checkNodeType(node, nodeType),
    });
    for (const [node, path] of descendantNodes) {
      if (DomEditor.checkNodeType(node, nodeType)) {
        return { node, path };
      }
    }
  }
  return null
}