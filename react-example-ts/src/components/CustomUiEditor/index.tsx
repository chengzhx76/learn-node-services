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

// TODO 集成需要改成动态值
const gameName = "test";
const commkeys = ["旁白", "黑屏文字"];

let initFinish = false;
const userRoles = new Map<string, string[]>();

function CustomUiEditor() {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");
  const [openMask, setOpenMask] = useState(false);

  // ==============base====================
  useEffect(() => {
    return () => {
      if (editor == null) return;
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
    if (initFinish) {
      putUiEditorText();
    }
  };

  // ==============http res====================
  function getRoleList() {
    request.get("/api/editor/getRoleExpressions").then((resp) => {
      if (resp.data.code === 200 && resp.data.data) {
        const list = resp.data.data;
        list.forEach((item: any) => {
          userRoles.set(item.role, item.expression);
        });
      }
    });
  }

  // ================main==================
  const [section, setSection] = useState<string>("西游记第99章");
  const [scene, setScene] = useState<string>("孙悟空大战白骨精");

  function addExpression(editor: IDomEditor, inputText: string) {
    const { selection } = editor;
    if (editor && selection) {
      editor.restoreSelection();

      const node = SlateNode.get(editor, selection.anchor.path);
      const text = SlateNode.string(node);
      if (text) {
        if (inputText === ":" || inputText === "：") {
          const isInclude = commkeys.some((commkey) => text.includes(commkey));
          if (isInclude) {
            return;
          } else {
            insertExpressionNode(editor, text);
          }
        }
      } else {
        if (inputText) {
          insertPlayNode(editor);
        }
      }
    }
  }

  function insertExpressionNode(_editor: IDomEditor, text: string) {
    console.log("insertExpressionNode===>", text);
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
    const { selection } = _editor;
    SlateTransforms.insertNodes(_editor, expressionNode, {
      at: selection?.anchor.path,
    });
  }

  function insertPlayNode(editor: IDomEditor) {
    console.log("insertPlayNode===>");
    const { selection } = editor;
    const playNode: UiPlayElement = {
      type: "uiplay",
      line: randomCode(),
      sceneName: scene,
      children: [{ text: "" }],
    };
    SlateTransforms.insertNodes(editor, playNode, {
      at: selection?.anchor.path,
    });
  }

  function selectUiExpression(line: number, role: string, expression: string) {
    // console.log("selectUiExpression===>", line, role, expression, `id_${line}`);
    setTimeout(() => {
      _putUiEditorText().then((res) => {
        if (res) {
          renderContent();
        }
      });
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
    const body = {
      gameName: gameName,
      sectionName: section,
      sceneName: sceneName,
    };
    request
      .post(`/api/editor/scene/command/${line}`, body)
      .then((resp: any) => {
        const data = resp.data.data;
        console.log("playUiLine===>", data);
      });
  }

  useEffect(() => {
    renderContent();
  }, [scene]);

  function renderSection(sceneName: string) {
    setScene(sceneName);
  }

  function renderContent() {
    if (!section) {
      return;
    }
    setOpenMask(true);
    initFinish = false;
    const body = {
      gameName: gameName,
      sectionName: section,
      sceneName: scene,
      sceneType: "editor",
    };

    request.post("/api/editor/sceneDetail", body).then((resp: any) => {
      const data = resp.data.data;
      if (data && editorRef.current) {
        if (userRoles.size === 0) {
          getRoleList();
        }
        renderScene(editorRef.current, data.dialogues, scene);
      }
    });
  }

  function renderScene(_editor: IDomEditor, list: any, scene: string) {
    if (!_editor) {
      return;
    }
    _editor.restoreSelection();
    _editor.clear();
    setTimeout(() => {
      for (let i = 0; i < list.length; i++) {
        const line = list[i];
        let text = line.desc;
        if (line.role) {
          text = `${line.role}${text}`;
        }

        renderText(_editor, text, i);
        renderExpression(_editor, line, i);
        if (text) {
          renderPlay(_editor, scene, line.sentence, i);
        }
      }
      setTimeout(() => {
        initFinish = true;
      }, 300);
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

    if (!role && !label) {
      return;
    }

    const localExs: string[] | undefined = userRoles.get(role);
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

  // 再渲染 Play Btn
  function renderPlay(
    _editor: IDomEditor,
    scene: string,
    line: string,
    i: number
  ) {
    if (!line) {
      line = randomCode();
    }
    const playNode: UiPlayElement = {
      type: "uiplay",
      sceneName: scene,
      line: line,
      children: [{ text: "" }],
    };
    SlateTransforms.insertNodes(_editor, playNode, { at: [i, 0] });
  }

  // 清空内容
  const clearRender = () => {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      editorRef.current.clear();
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
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTg1ODk3NTUsImV4cCI6MTcxODY3NjE1NX0.tFT_dxOPSxqwCKlIfL2eCNwVvLFQ8tEorrkF-fJWUq4`,
    },
    showUploadList: false,
    onChange(info) {
      setOpenMask(true);
      if (info.file.status === "done") {
        if (editorRef.current) {
          const data = info.file.response.data;

          if (data && data.dialogues.length === 0) {
            return;
          }
          renderScene(editorRef.current, data.dialogues, scene);
        }
      }
    },
  };

  const _putUiEditorText = () => {
    return new Promise((resolve, reject) => {
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
        // console.log("=======scenes======>", expression, text, line, scenes);
      }
      let text = "";
      scenes.forEach((scene) => {
        if (scene.text) {
          text += `${scene.line}|${scene.expression}|${scene.text}\n`;
        } else {
          text += "\n";
        }
      });
      // console.log("cheng.发送-scenes-text======> ", text);

      const body = {
        gameName: gameName,
        sectionName: section,
        sceneName: scene,
        dialogue: text,
      };
      // 动态上传用户输入内容
      request
        .post("/api/editor/editUiScene/dialogue", body)
        .then((resp: any) => {
          // console.log("===保存场景内容==>", resp.data.data);
          resolve(true);
        });
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
  const insertText = () => {
    if (editor == null) return;
    editor.insertText("hh");
  };
  const undoText = () => {
    if (editor != null && editor.undo) {
      editor.undo();
    }
  };
  const redoText = () => {
    if (editor != null && editor.redo) {
      editor.redo();
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
        editorType: "ui",
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
        <button onClick={insertText}>insertText</button>
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
        <h3>{scene}</h3>
        <button onClick={() => renderSection("孙悟空大战白骨精")}>
          渲染(孙悟空大战白骨精)
        </button>
        <br />
        <button onClick={() => renderSection("孙悟空大战无天")}>
          渲染(孙悟空大战无天)
        </button>
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
