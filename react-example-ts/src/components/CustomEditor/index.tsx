import "@wangeditor/editor/dist/css/style.css";
import "./style.css";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import {
  IDomEditor,
  DomEditor,
  IEditorConfig,
  Boot,
  SlateTransforms,
  SlateEditor,
  SlateNode,
  SlateRange,
} from "@wangeditor/editor";
import mentionModule, { MentionElement } from "../../module/mention";
import uieditorModule, {
  UiExpressionElement,
  UiPlayElement,
} from "../../module/uieditor";
// Boot.registerModule(mentionModule);
Boot.registerModule(uieditorModule);

// 显示弹框
function showModal(editor: IDomEditor) {
  console.log("====>showModal");
}
// 隐藏弹框
function hideModal(editor: IDomEditor) {
  console.log("====>showModal");
}

function addPlay(editor: IDomEditor) {
  // console.log("====>addPlay");
}

// 隐藏弹框
function addExpression(editor: IDomEditor) {
  console.log("====>addExpression");
  const { selection } = editor;
  // console.log("selection", selection);
  const expressionNode: UiExpressionElement = {
    type: "uiexpression",
    role: "Role-he",
    list: [
      {
        label: "哈哈",
        value: "1",
      },
      {
        label: "呵呵",
        value: "2",
      },
    ],
    children: [{ text: "" }],
  };
  const playNode: UiPlayElement = {
    type: "uiplay",
    line: "1",
    children: [{ text: "" }],
  };

  /* const block = SlateEditor.above(editor, {
    match: (n) => SlateEditor.isBlock(editor, n),
    // match: (n) => DomEditor.checkNodeType(n, "uiexpression"),
  });

  console.log("block==>", block); */

  if (editor && selection) {
    editor.restoreSelection(); // 恢复选区

    const node = SlateNode.get(editor, selection.anchor.path);
    const text = SlateNode.string(node);
    console.log("text", text);
    if (text && text.indexOf(":") > -1) {
      return;
    }
    /* const [block] = SlateEditor.nodes(editor, {
      match: (n) => SlateEditor.isBlock(editor, n),
    // });

    console.log("block==>", block);
    const [blockNode] = block;
    console.log("blockNode==>", blockNode); */

    /* const node = editor.children[selection.anchor.path[0]];
    console.log("nodes==>", node); */

    /* const type = DomEditor.getNodeType(node.children[0]);
    console.log("type==>", type); */

    // const nodeType = DomEditor.getSelectedNodeByType(editor, "paragraph");
    // console.log("nodeType==>", nodeType);

    /* const nodes = SlateNode.get(editor, selection.anchor.path); // !! 获取文本
    console.log("nodes", nodes);
    const type = DomEditor.getNodeType(nodes);
    console.log("type==>", type); */

    /* const line = selection.anchor.path[0] as number;
    if (editor.children) {
      const lineNode = editor.children[line];
      console.log("lineNode", lineNode);
      // const childrenNodes = lineNode.children;
    } */

    /* const elements = DomEditor.getSelectedElems(editor);
    // console.log("elements", elements);
    // console.log("elements[0].children", elements[0].children);

    const childrens = elements[0].children;
    for (let i = 0; i < childrens.length; i++) {
      console.log("childrens[i]", childrens[i]);
    } */

    /* const [cellNodeEntry] = SlateEditor.nodes(editor, {
      match: (n) => {
        const type = DomEditor.getNodeType(n);
        console.log("type==>", type);
        console.log("n==>", n);
        // console.log("isNodeSelected==>", DomEditor.isNodeSelected(editor, n));

        // return Element.isElement(n) && n.type === "cell";
        return true;
      },
    }); */
    /* console.log("cellNodeEntry==> ", cellNodeEntry);
    if (cellNodeEntry) {
      console.log("cellNodeEntry==> ", cellNodeEntry);
    } */

    /* for (let element of elements) {
      console.log("element", element);
    } */

    // 遍历子节点
    /* for (const [child, childPath] of nodes) {
      if (child.type) {
        // 检查节点是否有类型
        elements.push({ node: child, path: childPath });
      }
    } */

    SlateTransforms.insertNodes(editor, expressionNode, {
      at: selection.anchor.path,
    });
    SlateTransforms.insertNodes(editor, playNode, {
      at: selection.anchor.path,
    });
  }
}

function CustomEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      uiEditotConfig: {
        addPlay, // 必须
        addExpression, // 必须
      },
      mentionConfig: {
        showModal,
        hideModal,
      },
    },
  };

  function insertMention() {
    const mentionNode: MentionElement = {
      type: "mention", // 必须是 'mention'
      value: "张三", // 文本
      info: { x: 1, y: 2 }, // 其他信息，自定义
      children: [{ text: "" }], // 必须有一个空 text 作为 children
    };

    if (editor) {
      editor.restoreSelection(); // 恢复选区
      // editor.deleteBackward("character"); // 删除 '@'
      editor.insertNode(mentionNode); // 插入 mention
      // editor.move(1); // 移动光标
    }
  }

  function insertUiExpression() {
    const expressionNode: UiExpressionElement = {
      type: "uiexpression",
      role: "Role-he",
      list: [
        {
          label: "哈哈",
          value: "1",
        },
        {
          label: "呵呵",
          value: "2",
        },
      ],
      children: [{ text: "" }],
    };

    if (editor) {
      editor.restoreSelection(); // 恢复选区
      editor.insertNode(expressionNode); // 插入 mention
      // DomEditor.findPath(editor, elem.children[0]);
      // SlateTransforms.insertNodes(editor, expressionNode, { at: [0, 0] });
    }
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      editorRef.current = null;
    };
  }, [editor]);

  const handleCreated = (_editor: IDomEditor) => {
    if (_editor == null) return;
    // console.log("handleCreated", _editor);
    setEditor(_editor);
    editorRef.current = _editor;

    // console.log("created.global.editor", editor, editorRef.current);
  };

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;
    // console.log("handleChange.getHtml()", _editor.getHtml());
    const uiPayDoms = document.querySelectorAll(".ui-play");
    if (uiPayDoms && uiPayDoms.length > 0) {
      for (let i = 0; i < uiPayDoms.length; i++) {
        const uiPayDom = uiPayDoms[i];
        if (uiPayDom && uiPayDom.parentNode && uiPayDom.parentNode.parentNode) {
          let lineDom = uiPayDom.parentNode.parentNode as HTMLElement;
          let warpDom = uiPayDom.parentNode as HTMLElement;
          lineDom.className = "line";
          warpDom.className = "warp-ui-play";
        }
      }
    }
  };

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={handleCreated}
          onChange={handleChange}
          mode="default"
          style={{ height: "300px", overflowY: "hidden" }}
        />
      </div>
      <div style={{ marginTop: "15px" }}>{html}</div>
      <button onClick={insertMention}>insertMention</button>
      <button onClick={insertUiExpression}>insertUiExpression</button>
    </>
  );
}

export default CustomEditor;
