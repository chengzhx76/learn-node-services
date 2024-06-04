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
import uieditorModule, {
  Expression,
  UiExpressionElement,
  UiPlayElement,
} from "../../module/uieditor";
Boot.registerModule(uieditorModule);

const roles = new Map<string, string[]>([
  ["哈哈", ["默认", "哈1", "哈2"]],
  ["呵呵", ["默认", "呵1", "呵2"]],
  ["山音麦", ["默认", "欢喜", "愤怒"]],
  ["功夫小子", ["默认", "战斗", "挑衅", "胜利", "失败"]],
  ["牛大力", ["默认", "大笑", "挑衅", "挑眉", "沮丧"]],
]);

const list = [
  {
    label: "哈2",
    role: "哈哈",
    desc: "我在哪儿，一觉醒来已然不知往事。",
  },
  {
    label: "愤怒",
    role: "山音麦",
    desc: "我在哪儿，一觉醒来已然不知往事。",
  },
  {
    label: "战斗",
    role: "功夫小子",
    desc: "好像进入幻境一般，这应该不是真相，咱们快逃离梦境吧；",
  },
  {
    label: "",
    role: "旁白",
    desc: "一段旁白文字；",
  },
  {
    label: "",
    role: "黑屏文字",
    desc: "一段黑屏文字；",
  },
  {
    label: "挑眉",
    role: "牛大力",
    desc: "你们的法力已消失，走不掉的！",
  },
];

function getNodesText(nodes: NodeListOf<ChildNode>, texts: string[] = []) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.parentElement &&
      node.parentElement.tagName.toLowerCase() === "span"
    ) {
      const content = node.textContent?.trim();
      if (content) {
        console.log(
          "node.nodeName====> ",
          node.nodeName,
          node.nodeValue,
          content
        );
        texts.push(content);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      getNodesText(node.childNodes, texts);
    }
    // console.log("==getNodesText=>");
  }
  return texts.join("");
}

function getHtmlText() {
  const lineDoms = document.querySelectorAll("div.w-e-text-container p");
  const scenes = [];
  for (let i = 0; i < lineDoms.length; i++) {
    const lineDom = lineDoms[i];
    const selectDom = lineDom.querySelector("select");
    let expression = "";
    if (selectDom) {
      expression = selectDom.value;
    }
    let text = getNodesText(lineDom.childNodes);
    scenes.push({
      expression,
      text,
    });
  }
  let text = "\n";
  scenes.forEach((scene) => {
    if (scene.text) {
      text += `${scene.expression}|${scene.text}\n`;
    }
  });
  console.log("scenes-text======> ", text);
}

function addPlay(editor: IDomEditor) {
  // console.log("====>addPlay");
}

// 隐藏弹框
function addExpression(editor: IDomEditor) {
  console.log("====>addExpression");
  const { selection } = editor;
  // console.log("selection", selection);

  if (editor && selection) {
    editor.restoreSelection(); // 恢复选区

    const node = SlateNode.get(editor, selection.anchor.path);
    const text = SlateNode.string(node);
    console.log("text", text);
    // console.log("text-all", editor.getText());
    // console.log("text-Html", editor.getHtml());
    if (text && (text.indexOf(":") > -1 || text.indexOf("：") > -1)) {
      return;
    }

    const expressionNode: UiExpressionElement = {
      type: "uiexpression",
      role: "Role-he",
      selected: "",
      list: [
        {
          label: "哈1",
          value: "哈1",
        },
        {
          label: "呵1",
          value: "呵1",
        },
      ],
      children: [{ text: "" }],
    };
    const playNode: UiPlayElement = {
      type: "uiplay",
      line: "1",
      children: [{ text: "" }],
    };

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

  /* useEffect(() => {
    return () => {};
  }, []); */

  function renderScenes() {
    if (!editor) {
      return;
    }
    editor.restoreSelection();

    for (let i = 0; i < list.length; i++) {
      /* let select = "";
      if (label) {
        const localExs: string[] | undefined = roles.get(role);
        let options = "";
        const exs: Expression[] = [];
        if (localExs) {
          for (let j = 0; j < localExs.length; j++) {
            const ex = localExs[j];
            exs.push({
              label: ex,
              value: ex,
            });
            options += `<option value="${ex}">${ex}</option>`;
          }
        }
        if (options) {
          select = `<select data-w-e-type="uiexpression" data-list="${encodeURIComponent(
            JSON.stringify(exs)
          )}" data-w-e-is-void data-w-e-is-inline">${options}</select>`;
        }
      } */

      // setTimeout(() => {
      // const insertHtml = `<p><span class="ui-play" data-w-e-type="uiplay" data-line="1" data-w-e-is-void data-w-e-is-inline">Play</span>${list[i].role}:${list[i].desc}</p>`;
      // console.log("insertHtml===> ", insertHtml);
      // editor.dangerouslyInsertHtml(insertHtml);
      // editor.setHtml(insertHtml);

      // renderExpression(editor, list, i);
      const text = `${list[i].role}:${list[i].desc}`;
      setTimeout(() => {
        renderText(editor, text, i);
        // editor.insertBreak();
      }, 100);
      setTimeout(() => {
        renderExpression(editor, list, i);
        renderPlay(editor, i);
        /* setTimeout(() => {
          renderText(editor, text, i);
        }, 1000); */
      }, 100);
      // }, 1000);

      // setHtml(insertHtml);

      /* 
      const expressionNode: UiExpressionElement = {
        type: "uiexpression",
        role: role,
        list: _exs,
        children: [{ text: "" }],
      };
      // editor.insertNode(expressionNode);
      SlateTransforms.insertNodes(editor, expressionNode, { at: [0, 0] }); */
    }
  }

  function renderText(editor: IDomEditor, text: string, i: number) {
    const p = { type: "paragraph", children: [{ text: text }] };
    SlateTransforms.insertNodes(editor, p, {
      at: [i],
      mode: "highest",
    });
  }
  function renderExpression(editor: IDomEditor, list: any, i: number) {
    const role = list[i].role;
    const label = list[i].label;
    if (label) {
      const localExs: string[] | undefined = roles.get(role);
      const exs: Expression[] = [];
      if (localExs) {
        for (let j = 0; j < localExs.length; j++) {
          const ex = localExs[j];
          exs.push({
            label: ex,
            value: ex,
          });
        }

        const expressionNode: UiExpressionElement = {
          type: "uiexpression",
          role: role,
          selected: label,
          list: exs,
          children: [{ text: "" }],
        };
        // console.log("sdsadasdasd", editor.selection?.anchor.path);
        // editor.insertNode(expressionNode);

        SlateTransforms.insertNodes(editor, expressionNode, { at: [i, 0] });
        // const p = { type: "paragraph", children: [{ text: "ddd" }] };
        /* SlateTransforms.insertNodes(editor, p, {
          at: [0, 0],
        }); */
        // const nodeList = [expressionNode, p];
        /* SlateTransforms.insertNodes(editor, expressionNode, {
          // at: editor.selection?.anchor.path,
          at: [i, 0],
        }); */
        /* SlateTransforms.insertNodes(editor, nodeList, {
          // at: editor.selection?.anchor.path,
          at: [i, 0],
        }); */
      }
    }
  }
  function renderPlay(editor: IDomEditor, i: number) {
    const playNode: UiPlayElement = {
      type: "uiplay",
      line: "",
      children: [{ text: "" }],
    };
    // console.log("sdsadasdasd", editor.selection?.anchor.path);
    // editor.insertNode(expressionNode);

    SlateTransforms.insertNodes(editor, playNode, { at: [i, 0] });
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      uiEditotConfig: {
        addPlay, // 必须
        addExpression, // 必须
      },
    },
  };

  function insertUiExpression() {
    const expressionNode: UiExpressionElement = {
      type: "uiexpression",
      role: "Role-he",
      selected: "",
      list: [
        {
          label: "哈哈",
          value: "哈哈",
        },
        {
          label: "呵呵",
          value: "呵呵",
        },
      ],
      children: [{ text: "" }],
    };

    if (editor) {
      editor.restoreSelection(); // 恢复选区
      SlateTransforms.insertNodes(editor, expressionNode, { at: [1, 0] });
      // editor.insertNode(expressionNode); // 插入 mention
      // DomEditor.findPath(editor, elem.children[0]);
      // SlateTransforms.insertNodes(editor, expressionNode, { at: [0, 0] });
    }
  }

  function addAside() {
    const p = { type: "paragraph", children: [{ text: "旁白:" }] };
    if (editor) {
      SlateTransforms.insertNodes(editor, p, {
        mode: "highest",
      });
    }
  }

  function addTell() {
    const p = { type: "paragraph", children: [{ text: "黑屏文字:" }] };
    if (editor) {
      SlateTransforms.insertNodes(editor, p, {
        mode: "highest",
      });
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

    parseHtml(_editor.getHtml());
    setUiPlayStyle();
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
      <button onClick={insertUiExpression}>insertUiExpression</button>
      <button onClick={renderScenes}>渲染场景</button>
      <button onClick={addAside}>插入旁白</button>
      <button onClick={addTell}>插入黑屏文字</button>
      <button onClick={getHtmlText}>获取内容</button>
    </>
  );
}

function parseHtml(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const lineDoms = doc.querySelectorAll("p");

  const scenes = [];

  for (let i = 0; i < lineDoms.length; i++) {
    const lineDom = lineDoms[i];
    const selectDom = lineDom.querySelector("select");
    let expression = "";

    if (selectDom) {
      expression = selectDom.value;
      // console.log("expression", expression);
    }

    const textNode = Array.from(lineDom.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    const text = textNode?.nodeValue;
    // console.log(`Text: ${text}`);

    scenes.push({
      expression,
      text,
    });
  }
  let text = "\n";
  scenes.forEach((item) => {
    if (item.text) {
      text += `${item.expression}|${item.text}\n`;
    }
  });
  console.log("scenes-text==> ", text);
}

function setUiPlayStyle() {
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
}

export default CustomEditor;
