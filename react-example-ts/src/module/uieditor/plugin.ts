import { IDomEditor, DomEditor, SlateTransforms, SlateEditor, SlateRange, SlateNode, SlateElement } from '@wangeditor/editor'
import { Location } from 'slate'
import { IExtendConfig } from './interface'

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { uiEditotConfig } = EXTEND_CONF as IExtendConfig
  return uiEditotConfig
}

const lineMap = new Map<number, string>()

// const colons = [':', '：']
const commkeys = ['旁白:', '旁白：', '黑屏文字:', '黑屏文字：']

function containColon(text:string) {
  return text.indexOf(':') !== -1 || text.indexOf('：') !== -1
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
      // console.log("SlateEditor.nodes.uiexpression===> ", node, path);
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
    const { selection } = editor;
    // console.log('deleteBackward.uiexpressionNode===> ', unit);
    if (!selection) {
      deleteBackward(unit);
      return
    }
    const _node = SlateNode.get(editor, selection.anchor.path);
    if (_node) {
      // const text = SlateNode.string(_node);
      // console.log('deleteBackward.befor.text===> ', text);
      /* const blockEntries = SlateEditor.nodes(editor);
      console.log('deleteBackward.blockEntries===> ', blockEntries);
      console.log('deleteBackward.editor.children===> ', editor.children); */
      
    }


    /* const firstParagraph = SlateNode.get(editor, [0]);
    const inlineNode1 = SlateNode.get(editor, [0, 1]);
    const inlineNode2 = SlateNode.get(editor, [0, 3]);
    // const inlineChildren = SlateNode.children(editor, [0, 1]);
    const type1 = DomEditor.getNodeType(inlineNode1);
    const type2 = DomEditor.getNodeType(inlineNode2);
    console.log("inlineNode.type1==>", type1);
    console.log("inlineNode.type2==>", type2);
    console.log('firstParagraph:', firstParagraph);
    console.log('inlineNode:', inlineNode1); */
    // console.log('inlineChildren:', Array.from(inlineChildren));


    // SlateTransforms.deselect(editor); // 确保没有选中内容

    deleteBackward(unit);

    
    const line = selection.anchor.path[0]
    console.log('line==> ',  line);
    if (SlateNode.has(editor, selection.anchor.path)) {
      const node = SlateNode.get(editor, selection.anchor.path);
      if (node) {
        const text = SlateNode.string(node);
        console.log('deleteBackward.after.text===> ', text);
        // console.log('deleteBackward.after.text=bool==> ', text && !(text.includes(':') || text.includes('：')));
  
        if (text) {
          const isInclude = commkeys.some(commkey => text.includes(commkey))
          console.log('deleteBackward.after.text=isInclude==> ', isInclude);
          if (isInclude) {
            return
          }
          const preText = lineMap.get(line)
          if (preText) {
            // console.log('deleteBackward.containColon(preText).containColon(text)===> ', preText, containColon(preText), text, containColon(text));
            if (containColon(preText) && !containColon(text)) {
              // console.log('deleteBackward.已删除全部冒号===> ', preText, text);
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

    
    /* let uiplayPath:Location = [0, 0]
    // SlateTransforms.removeNodes(newEditor, { at: [0, 3] });
    for (const [node, path] of SlateNode.descendants(editor, { from: [0] })) {
      const type = DomEditor.getNodeType(node);
      if (type === 'uiplay' || type === 'uiexpression') {
        console.log("descendants.type==>", type, path);
        console.log("descendants.path==>", [path[0], path[1]]);
        uiplayPath = path
        // SlateTransforms.removeNodes(newEditor, { at: [0, 3] });
        // SlateTransforms.removeNodes(newEditor, { at: path });
        // SlateTransforms.delete(editor, { at: [path[0], path[1]] })
        
      }
    }
    SlateTransforms.removeNodes(newEditor, { at: uiplayPath }); */


    // SlateTransforms.select(editor, selection); // 恢复之前的选区

    /* const nodeEntries = SlateEditor.nodes(editor, {
      match: (node: SlateNode) => {
      if (SlateElement.isElement(node)) {
        const type = DomEditor.getNodeType(node)
        console.log('nodeEntries.type==>', type);
          if (type === 'paragraph') {
            return true // 匹配 paragraph
          }
        }
        return false
      },
      universal: true,
    })

    if (nodeEntries == null) {
      console.log('当前未选中的 paragraph')
    } else {
      for (let nodeEntry of nodeEntries) {
        const [node, path] = nodeEntry
        console.log('选中了 paragraph 节点', node)
        console.log('节点 path 是', path)
      }
    } */

    /* const childrens = SlateNode.children(editor, selection.anchor.path);
    console.log('deleteBackward.editor.childrens===> ', childrens);  */
    
    
    /* const nodeEntries = SlateEditor.nodes(editor, {
      match: (node) => {
        if (SlateElement.isElement(node)) {
          return DomEditor.getNodeType(node) === 'uiexpression'; // 匹配 paragraph
        }
        return false;
      },
      universal: true,
    });
    console.log('deleteBackward.befor.nodeEntries===> ', nodeEntries); */

    // const node = DomEditor.getSelectedTextNode(newEditor);
    // console.log('deleteBackward.node===> ', node);
    

    // SlateTransforms.delete(newEditor, { at: selection?.anchor.path[0] - 1 });
    /* if (selection && SlateRange.isCollapsed(selection)) {
      const parentBlockEntry = SlateEditor.above(editor, {
        match: n => SlateEditor.isBlock(editor, n),
        at: selection,
      })
      
      console.log('parentBlockEntry===> ', parentBlockEntry);

      if (parentBlockEntry) {
        const [, parentBlockPath] = parentBlockEntry
        console.log('parentBlockPath===> ', parentBlockPath, selection.anchor);
        const parentElementRange = SlateEditor.range(editor, parentBlockPath, selection.anchor)

        const currentLineRange = findCurrentLineRange(newEditor, parentElementRange)

        console.log('currentLineRange===> ', currentLineRange);

        if (!SlateRange.isCollapsed(currentLineRange)) {
          // SlateTransforms.delete(editor, { at: currentLineRange })
        }
      }
    } */
    /* SlateTransforms.select(editor, {
      anchor: { path:[0,1], offset: 0 },
      focus: { path:[0,1], offset: 2 },
    }) */

    // console.log('deleteBackward.selection.anchor.path===> ', selection.anchor.path);

    // SlateTransforms.delete(editor, { at: { path: selection.anchor.path, offset: 0 } })
    /* SlateTransforms.removeNodes(editor, {
      at: { path: selection.anchor.path, offset: 0 },
      match: n => DomEditor.checkNodeType(n, 'uiplay'),
    }) */

    /* const blockEntries = SlateEditor.nodes(editor, {
      match: n => {
        return DomEditor.getNodeType(n) === 'uiexpression';
      },
    }); */

    /* SlateTransforms.removeNodes(editor, {
      at: selection.anchor.path,
      match: n => {
        return DomEditor.getNodeType(n) === 'uiexpression';
      },
      mode: 'lowest',
      voids: true,
    }); */

    /* const node = SlateNode.get(editor, selection.anchor.path);
    if (node) {
      const text = SlateNode.string(node);
      console.log('deleteBackward.after.text===> ', text);
    } */

    /* SlateTransforms.removeNodes(editor, {
      at: selection.anchor.path,
      match: n => {
        return DomEditor.getNodeType(n) === 'uiexpression';
      },
    }); */ //删除节点
    // editor.restoreSelection(); // 恢复选区
    
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

const removeNode = (nodeType: string, editor: IDomEditor) => {
  let removePath: Location = []
  let line = 0
  if (editor && editor.selection) {
    line = editor.selection.anchor.path[0]
  }
  for (const [node, path] of SlateNode.descendants(editor, { from: [line] })) {
      const type = DomEditor.getNodeType(node);
      console.log('==removeNode.type===> ', type);
      if (type === nodeType) {
        removePath = path
        // console.log("descendants.type==>", type, path);
        // console.log("descendants.path==>", [path[0], path[1]]);
        // SlateTransforms.removeNodes(newEditor, { at: [0, 3] });
        // SlateTransforms.removeNodes(newEditor, { at: path });
        // SlateTransforms.delete(editor, { at: [path[0], path[1]] })
        
      }
  }
  if (removePath.length > 0) {
    SlateTransforms.removeNodes(editor, { at: removePath });
  }
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

const areRangesSameLine = (editor: IDomEditor, range1: SlateRange, range2: SlateRange) => {
  const rect1 = DomEditor.toDOMRange(editor, range1).getBoundingClientRect()
  const rect2 = DomEditor.toDOMRange(editor, range2).getBoundingClientRect()
  return doRectsIntersect(rect1, rect2) && doRectsIntersect(rect2, rect1)
}

const doRectsIntersect = (rect: DOMRect, compareRect: DOMRect) => {
  const middle = (compareRect.top + compareRect.bottom) / 2
  return rect.top <= middle && rect.bottom >= middle
}

export default withUiEditor