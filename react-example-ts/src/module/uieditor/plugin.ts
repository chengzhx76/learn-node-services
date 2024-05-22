import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange } from '@wangeditor/editor'
import { IExtendConfig } from './interface'

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { uiEditotConfig } = EXTEND_CONF as IExtendConfig
  return uiEditotConfig
}

function withUiEditor<T extends IDomEditor>(editor: T): T {   // TS 语法

  const { insertText, isInline, isVoid, normalizeNode, insertBreak, insertNode, deleteBackward } = editor
  const newEditor = editor

  newEditor.insertText = t => {
    
    // mention 相关配置
    const { addExpression, addPlay } = getUiEditorConfig(newEditor)

    if (t === ':' || t === '：') { 
      if (addExpression) addExpression(newEditor)
      if (addPlay) addPlay(newEditor)
    }
    insertText(t)
  }

  // 重新 normalize
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)
    // console.log(`normalizeNode===> type:<${type}> path:<${path}>`, node);
    if (type !== 'uiexpression') {
      // 未命中 uiexpression ，执行默认的 normalizeNode
      
    }
    const blockEntries = SlateEditor.nodes(editor, {
      match: n => {
        return DomEditor.getNodeType(n) === 'uiexpression';
      },
    });

    for (const [node, path] of blockEntries) {
      console.log("SlateEditor.nodes.uiexpression===> ", node, path);
    }
    /* const blockEntry = SlateEditor.above(editor, {
      match: (n: any) => SlateEditor.isBlock(editor, n),
    }); */
    // editor 顶级 node
    // const topLevelNodes = newEditor.children || []
    // console.log('topLevelNodes===> ', topLevelNodes);
    return normalizeNode([node, path])
  }


  newEditor.insertBreak = () => { 
    const uiexpressionNode = DomEditor.getSelectedTextNode(newEditor);
    console.log('insertBreak.uiexpressionNode===> ', uiexpressionNode);
    insertBreak();
  }

  newEditor.insertNode = (node) => {
    const type = DomEditor.getNodeType(node)

    console.log('insertNode.type===> ', type);
    return insertNode(node);
  }


  
  newEditor.deleteBackward = (unit) => { 
    console.log('deleteBackward.uiexpressionNode===> ', unit);
    const { selection } = editor;
    // SlateTransforms.delete(newEditor, { at: selection?.anchor.path[0] - 1 });
    if (editor.selection && SlateRange.isCollapsed(editor.selection)) {
      const parentBlockEntry = SlateEditor.above(editor, {
        match: n => SlateEditor.isBlock(editor, n),
        at: editor.selection,
      })

      if (parentBlockEntry) {
        const [, parentBlockPath] = parentBlockEntry
        const parentElementRange = SlateEditor.range(editor, parentBlockPath, editor.selection.anchor)

        const currentLineRange = findCurrentLineRange(newEditor, parentElementRange)

        if (!SlateRange.isCollapsed(currentLineRange)) {
          SlateTransforms.delete(editor, { at: currentLineRange })
        }
      }
    }
    deleteBackward(unit);
  }

 // 重写 isInline
  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'uiexpression' || type === 'uiplay') {
      return true
    }
    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'uiexpression' || type === 'uiplay') {
      return true
    }

    return isVoid(elem)
  }


  return editor
}

const findCurrentLineRange = (editor: IDomEditor, parentRange: SlateRange): SlateRange => {
  const parentRangeBoundary = SlateEditor.range(editor, SlateRange.end(parentRange))
  const positions = Array.from(SlateEditor.positions(editor, { at: parentRange }))

  let left = 0
  let right = positions.length
  let middle = Math.floor(right / 2)

  if (areRangesSameLine(editor, SlateEditor.range(editor, positions[left]), parentRangeBoundary)) {
    return SlateEditor.range(editor, positions[left], parentRangeBoundary)
  }

  if (positions.length < 2) {
    return SlateEditor.range(editor, positions[positions.length - 1], parentRangeBoundary)
  }

  while (middle !== positions.length && middle !== left) {
    if (areRangesSameLine(editor, SlateEditor.range(editor, positions[middle]), parentRangeBoundary)) {
      right = middle
    } else {
      left = middle
    }

    middle = Math.floor((left + right) / 2)
  }

  return SlateEditor.range(editor, positions[right], parentRangeBoundary)
}


const doRectsIntersect = (rect: DOMRect, compareRect: DOMRect) => {
  const middle = (compareRect.top + compareRect.bottom) / 2
  return rect.top <= middle && rect.bottom >= middle
}

const areRangesSameLine = (editor: IDomEditor, range1: SlateRange, range2: SlateRange) => {
  const rect1 = DomEditor.toDOMRange(editor, range1).getBoundingClientRect()
  const rect2 = DomEditor.toDOMRange(editor, range2).getBoundingClientRect()
  return doRectsIntersect(rect1, rect2) && doRectsIntersect(rect2, rect1)
}

export default withUiEditor