import "@wangeditor/editor/dist/css/style.css";
import "./style.css";
import "./layout.css";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { randomCode } from "../../util";

import {
  IDomEditor,
  IEditorConfig,
  Boot,
  SlateTransforms,
  SlateNode,
} from "@wangeditor/editor";

import request from "../../util/request";
import { debounce } from "../../util";

import uieditorModule, {
  Expression,
  UiExpressionElement,
  UiPlayElement,
} from "../../module/uieditor";
Boot.registerModule(uieditorModule);

const gameName = "test";
let sceneShellName = "";

const userRoles = new Map<string, string[]>();

console.log("init CustomUiEditor.test");

function CustomUiEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");
  const [openMask, setOpenMask] = useState(false);

  // ==============base====================
  useEffect(() => {
    return () => {
      console.log("destroy.CustomUiEditor");
      if (editor == null) return;
      console.log("destroy.CustomUiEditor2");
      editor.destroy();
      setEditor(null);
      if (editorRef.current == null) return;
      editorRef.current.destroy();
      editorRef.current = null;
    };
  }, [editor]);

  const handleCreated = (_editor: IDomEditor) => {
    if (_editor == null) return;
    setEditor(_editor);
    editorRef.current = _editor;
  };

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;
    setUiPlayStyle();
  };

  // ==============http res====================
  function getRoleList() {
    request.get("/api/editor/getRoleExpressions").then((resp) => {
      if (resp.data.code === 200 && resp.data.data) {
        const list = resp.data.data;
        list.forEach((item: any) => {
          userRoles.set(item.role, item.expression);
        });
        // console.log("====> userRoles", userRoles);
      }
    });
  }

  // ================main==================
  const [section, setSection] = useState<string>("1");
  const [scene, setScene] = useState<string>("北海");

  function addExpression(editor: IDomEditor) {
    console.log("====>addExpression");
    const { selection } = editor;
    if (editor && selection) {
      editor.restoreSelection();

      const node = SlateNode.get(editor, selection.anchor.path);
      const text = SlateNode.string(node);
      console.log("text", text);
      if (text && (text.indexOf(":") > -1 || text.indexOf("：") > -1)) {
        return;
      }
      const role = text.substring(0, text.length);
      let exs: string[] | undefined = userRoles.get(role);
      const list: Expression[] = [];
      if (exs) {
        exs.forEach((ex) => {
          list.push({
            label: ex,
            value: ex,
          });
        });
      }
      if (!list || list.length === 0) {
        list.push({
          label: "无立绘",
          value: "",
        });
      }
      const expressionNode: UiExpressionElement = {
        type: "uiexpression",
        role: role,
        selected: "",
        list: list,
        children: [{ text: "" }],
      };
      const playNode: UiPlayElement = {
        type: "uiplay",
        line: randomCode(),
        sceneName: sceneShellName,
        children: [{ text: "" }],
      };

      SlateTransforms.insertNodes(editor, expressionNode, {
        at: selection.anchor.path,
      });
      SlateTransforms.insertNodes(editor, playNode, {
        at: selection.anchor.path,
      });
    }
  }

  function selectUiExpression(line: number, role: string, expression: string) {
    console.log("selectUiExpression===>", line, role, expression, `id_${line}`);
    setTimeout(() => {
      _putUiEditorText();
    }, 200);
    /* const selectDom = document.getElementById(
      `id_${line}`
    ) as HTMLSelectElement;

    for (let i = 0; i < selectDom.options.length; i++) {
      const option = selectDom.options[i];

      if (option.hasAttribute("selected")) {
        option.removeAttribute("selected");
      }
      if (option.value === expression) {
        option.setAttribute("selected", "");
      }
    } */
  }
  function playUiLine(sceneName: string, line: string) {
    console.log("playUiLine===>", line, sceneName);
  }

  useEffect(() => {
    renderContent();
    sessionStorage.setItem("__scene", scene);
  }, [scene]);

  function renderSection(sceneName: string) {
    setScene(sceneName);
  }

  function renderContent() {
    if (!section) {
      return;
    }
    const body = {
      gameName: gameName,
      sectionName: section,
      sceneName: scene,
      sceneType: "editor",
    };

    setOpenMask(true);
    request.post("/api/editor/sceneDetail", body).then((resp: any) => {
      const data = resp.data.data;
      if (data && editorRef.current) {
        if (userRoles.size === 0) {
          getRoleList();
        }
        sceneShellName = data.scene;
        renderScene(editorRef.current, data.dialogues, data.scene);
      }
    });
  }

  function renderScene(_editor: IDomEditor, list: any, sceneShellName: string) {
    if (!_editor) {
      return;
    }
    _editor.restoreSelection();
    _editor.clear();
    // _editor.setHtml("");
    // setHtml("");
    setTimeout(() => {
      for (let i = 0; i < list.length; i++) {
        const line = list[i];
        let text = line.desc;
        if (line.role) {
          text = `${line.role}:${text}`;
        }

        renderText(_editor, text, i);
        renderExpression(_editor, line, i);
        renderPlay(_editor, sceneShellName, i);
      }
      setOpenMask(false);
    }, 1000);
  }

  // 先渲染文本内容
  function renderText(_editor: IDomEditor, text: string, i: number) {
    const p = { type: "paragraph", children: [{ text: text }] };
    SlateTransforms.insertNodes(_editor, p, {
      at: [i],
      mode: "highest",
    });
  }

  // 再渲染查分列表
  function renderExpression(_editor: IDomEditor, line: any, i: number) {
    const role = line.role;
    const label = line.label;
    if (label) {
      const localExs: string[] | undefined = userRoles.get(role);
      // console.log('cheng.查找角色的差分图===> ', role, localExs);
      if (!localExs || localExs.length === 0) {
        return;
      }
      const exs: Expression[] = [];
      if (localExs) {
        for (let ex of localExs) {
          exs.push({
            label: ex,
            value: ex,
          });
        }
      } else {
        exs.push({
          label: "无立绘",
          value: "",
        });
      }
      const expressionNode: UiExpressionElement = {
        type: "uiexpression",
        role: role,
        selected: label,
        list: exs,
        children: [{ text: "" }],
      };

      SlateTransforms.insertNodes(_editor, expressionNode, { at: [i, 0] });
    }
  }

  // 再渲染 Play Btn
  function renderPlay(
    _editor: IDomEditor,
    sceneShellName: string,
    line: number
  ) {
    const playNode: UiPlayElement = {
      type: "uiplay",
      sceneName: sceneShellName,
      line: randomCode(),
      children: [{ text: "" }],
    };
    SlateTransforms.insertNodes(_editor, playNode, { at: [line, 0] });
  }

  // 清空内容
  const clearRender = () => {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      editorRef.current.clear();
      // editorRef.current.setHtml("");
      // console.log("clearRender==>");
      // setHtml("1");
    }
  };

  const uploadText: UploadProps = {
    name: "file",
    action: "/api/editor/editUiScene/upload",
    accept: "txt, text/plain",
    data: {
      gameName: gameName,
      sectionName: section,
      sceneName: scene,
    },
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTgxODU3ODQsImV4cCI6MTcxODI3MjE4NH0.s7XS_2yhjCzN27BcG8sv3Ql8b62-nL_vbhOvQTCbR4A`,
    },
    showUploadList: false,
    onChange(info) {
      setOpenMask(true);
      if (info.file.status === "done") {
        if (editorRef.current) {
          const data = info.file.response.data;

          // console.log("uploadText===>", list);

          if (data && data.dialogues.length === 0) {
            return;
          }
          /* editorRef.current.restoreSelection();
          editorRef.current.clear(); */

          renderScene(editorRef.current, data.dialogues, data.scene);
        }
      }
    },
  };

  const _putUiEditorText = () => {
    // TODO 改成异步，【异步成功后刷新页面 renderContent(); 对于选择表情后】
    const lineDoms = document.querySelectorAll("div.w-e-text-container p");
    const scenes = [];
    for (let lineDom of lineDoms) {
      const selectDom = lineDom.querySelector("select");

      const playDom = lineDom.querySelector(".ui-play");
      let line = "";
      if (playDom && playDom.hasAttribute("data-line")) {
        line = playDom.getAttribute("data-line") as string;
      }

      let expression = "";
      if (selectDom) {
        expression = selectDom.value;
      }
      let text = getChildNodesText(lineDom.childNodes);
      scenes.push({
        expression,
        text,
        line,
      });
    }
    let text = "";
    scenes.forEach((scene) => {
      if (scene.text) {
        text += `${scene.expression}|${scene.text}\n`;
      }
    });
    // console.log('cheng.发送-scenes-text======> ', text);

    const sectionName = sessionStorage.getItem("__scene");
    const body = {
      gameName: gameName,
      sectionName: section,
      sceneName: sectionName,
      dialogue: text,
    };
    // 动态上传用户输入内容
    request.post("/api/editor/editUiScene/dialogue", body).then((resp: any) => {
      // console.log("===保存场景内容==>", resp.data.data);
    });
  };

  const putUiEditorText = debounce(_putUiEditorText, 800);

  function getChildNodesText(
    nodes: NodeListOf<ChildNode>,
    texts: string[] = []
  ) {
    for (let node of nodes) {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.parentElement &&
        node.parentElement.tagName.toLowerCase() === "span"
      ) {
        const content = node.textContent?.trim();
        if (content) {
          texts.push(content);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        getChildNodesText(node.childNodes, texts);
      }
    }
    return texts.join("");
  }

  const insertHtml = () => {
    if (editor == null) return;
    const html = `<p>我是html</p>`;
    editor.restoreSelection();
    setHtml(html);
  };
  const undoText = () => {
    if (editor != null && editor.undo) {
      editor.undo();
      setTimeout(() => {
        putUiEditorText();
      }, 200);
    }
  };
  const redoText = () => {
    if (editor != null && editor.redo) {
      editor.redo();
      setTimeout(() => {
        putUiEditorText();
      }, 200);
    }
  };
  // =================end=================

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      customEditotConfig: {
        addExpression,
        selectUiExpression,
        playUiLine,
        putUiEditorText,
      },
    },
  };
  return (
    <div className="ui body">
      {openMask && <div className="mask" />}
      {/* {左侧栏} */}
      <div className="sidebar fixed-sidebar-left">
        <h1>Ui编辑器</h1>
        <button onClick={insertHtml}>insertHtml</button>
        <br />
        <button onClick={() => setHtml("")}>setHtml</button>
        <br />
        <button onClick={getRoleList}>获取用户角色</button>
        <br />
        <button onClick={undoText}>撤销</button>
        <br />
        <button onClick={redoText}>重做</button>
        <br />
        <Upload {...uploadText} className="uploadtxt">
          <button>上传txt</button>
        </Upload>
        {/* <div style={{ marginTop: "15px" }}>{html}</div> */}
      </div>

      {/* {中间区域} */}
      <div className="main-content">
        <div className="editor">
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={handleCreated}
            onChange={handleChange}
            mode="simple"
            style={{ minHeight: "300px" }}
          />
        </div>

        <div className="push">
          <div className="btn">发布</div>
        </div>
      </div>

      {/* {右侧栏} */}
      <div className="sidebar fixed-sidebar-right">
        {/* 南海观音大战孙猴子|text
      <br />
      <input
        type="text"
        value={section}
        onChange={(e) => setSection(e.target.value)}
        placeholder="Type your section"
      />
      <br /> */}
        <h1>{scene}</h1>
        <button onClick={() => renderSection("北海")}>渲染(北海)</button>
        <br />
        <button onClick={() => renderSection("南海")}>渲染(南海)</button>
        <br />
        <button onClick={clearRender}>清空渲染</button>
      </div>
    </div>
  );
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

export default CustomUiEditor;
