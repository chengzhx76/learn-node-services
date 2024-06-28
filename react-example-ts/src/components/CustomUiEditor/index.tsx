import "@wangeditor/editor/dist/css/style.css";
import "./style.css";
import "./layout.css";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import type { UploadProps } from "antd";
import { Upload } from "antd";

import { Path } from "slate";

import {
  IDomEditor,
  SlateEditor,
  IEditorConfig,
  Boot,
  SlateTransforms,
  SlateNode,
  DomEditor,
} from "@wangeditor/editor";

import request from "../../util/request";
import { debounce, calculateHash, randomCode } from "../../util";
import { getEditorNode, hasNode } from "../../module/utils";

import uieditorModule, {
  Expression,
  UiExpressionElement,
  UiPlayElement,
  checkStandard,
  setUiPlayStyle,
  getText,
} from "../../module/uieditor";
Boot.registerModule(uieditorModule);

const gameName = "test";
const commkeys = ["旁白", "黑屏文字"];

let initFinish = false;
let initTextHash = "";
const userRoles = new Map<string, string[]>();

function CustomUiEditor() {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");
  const [openMask, setOpenMask] = useState(false);

  // ==============base====================
  useEffect(() => {
    // @ts-ignore
    window["editorMode"] = "ui";
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
    checkStandard();
    if (initFinish) {
      putUiEditorText();
    }
  };

  // ==============http res====================
  function getRoleList() {
    request.get("/api/role/getRoleExpressions").then((resp) => {
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
      const linePath = selection.anchor.path;
      const node = SlateNode.get(editor, linePath);
      const text = SlateNode.string(node);
      if (text) {
        if (inputText === ":" || inputText === "：") {
          const isInclude = commkeys.some((commkey) => text.includes(commkey));
          if (!isInclude && !hasNode("uiexpression", editor)) {
            addExpressionNode(editor, text, linePath);
          }
        } else {
          // 输入其他文字检查下是否修改了角色
          setTimeout(() => {
            checkExpression(editor);
          }, 800);
        }
      } else {
        if (inputText && !hasNode("uiplay", editor)) {
          addPlayNode(editor, linePath);
        }
      }
    }
  }

  /* function hasEx(exEle: UiExpressionElement) {
    if (
      !exEle.selected ||
      "无立绘" === exEle.selected ||
      exEle.list.length === 0
    ) {
      console.log("=====hasEx1======");
      return false;
    }
    for (let i = 0; i < exEle.list.length; i++) {
      const ex = exEle.list[i];
      if (ex.value === "无立绘") {
        console.log("=====hasEx2======");
        return false;
      }
    }
    console.log("=====hasEx3======");
    return true;
  } */

  function modifyNode(
    editor: IDomEditor,
    path: Path,
    role: string,
    exs: string[]
  ) {
    const list: Expression[] = [];
    exs.forEach((ex) => {
      list.push({
        label: ex,
        value: ex,
      });
    });
    const expressionNode: UiExpressionElement = {
      type: "uiexpression",
      role: role,
      selected: list[0].value,
      list: list,
      children: [{ text: "" }],
    };
    // console.log(`===expressionNode=`, expressionNode);
    SlateTransforms.setNodes(editor, expressionNode, {
      at: path,
      match: (n) => DomEditor.checkNodeType(n, "uiexpression"),
    });
  }

  function checkExpression(editor: IDomEditor) {
    const { selection } = editor;
    if (editor && selection) {
      const linePath = selection.anchor.path;
      const exNode = getEditorNode("uiexpression", editor);
      if (!exNode) {
        return;
      }
      const exEle = exNode.node as UiExpressionElement;
      // console.log("exEle===> ", exEle);

      const textNode = SlateNode.get(editor, linePath);
      const lineText = SlateNode.string(textNode);
      const index =
        lineText.indexOf(":") > -1
          ? lineText.indexOf(":")
          : lineText.indexOf("：");
      const role = lineText.slice(0, index);

      let exs: string[] | undefined = userRoles.get(role);

      // console.log(`===role=<${role}>`, lineText, role, exs);

      if (exs && exs.length) {
        // console.log("========if=============", exEle.selected);
        if (exEle.selected === "无立绘") {
          modifyNode(editor, exNode.path, role, exs);
        }
      } else {
        // console.log("========else=============");
        modifyNode(editor, exNode.path, role, ["无立绘"]);
      }
    }
  }

  function addExpressionNode(
    _editor: IDomEditor,
    text: string,
    linePath: Path
  ) {
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
        value: "无立绘",
      });
    }
    const expressionNode: UiExpressionElement = {
      type: "uiexpression",
      role: role,
      selected: list[0].value,
      list: list,
      children: [{ text: "" }],
    };
    SlateTransforms.insertNodes(_editor, expressionNode, {
      at: linePath,
    });
  }

  function addPlayNode(editor: IDomEditor, linePath: Path) {
    const playNode: UiPlayElement = {
      type: "uiplay",
      line: randomCode(),
      sceneName: scene,
      children: [{ text: "" }],
    };
    SlateTransforms.insertNodes(editor, playNode, {
      at: linePath,
    });
  }

  function selectUiExpression(editor: IDomEditor, expression: string) {
    const exNode = getEditorNode("uiexpression", editor);
    if (exNode) {
      const exEle = exNode.node as UiExpressionElement;
      const expressionNode: UiExpressionElement = {
        type: "uiexpression",
        role: exEle.role,
        selected: expression,
        list: exEle.list,
        children: [{ text: "" }],
      };
      SlateTransforms.setNodes(editor, expressionNode, {
        at: exNode.path,
        match: (n) => DomEditor.checkNodeType(n, "uiexpression"),
      });
    }
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

  const calculateTextHash = () => {
    setTimeout(() => {
      if (!initFinish || editorRef.current == null) {
        return;
      }
      const t = editorRef.current.getText();
      if (!t) {
        return;
      }
      initTextHash = calculateHash(t);
    }, 1200);
  };

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
        calculateTextHash();
        setOpenMask(false);
      }, 300);
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

    const exs: string[] | undefined = userRoles.get(role);
    const list: Expression[] = [];
    if (exs) {
      for (let ex of exs) {
        list.push({
          label: ex,
          value: ex,
        });
      }
    } else {
      list.push({
        label: "无立绘",
        value: "无立绘",
      });
    }

    const selected = label ? label : list[0].value;

    const expressionNode: UiExpressionElement = {
      type: "uiexpression",
      role: role,
      selected: selected,
      list: list,
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
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTk0NzU3MDYsImV4cCI6MTcxOTU2MjEwNn0.g7of52U55BJrwFqyhP_zwYn9TidWusrFrkYQI3wNyKw`,
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

  const putUiEditorText = debounce(() => {
    const scenes = getText();
    let text = "";
    scenes.forEach((scene) => {
      if (scene.text) {
        text += `${scene.line}|${scene.expression}|${scene.text}\n`;
      } else {
        text += "\n";
      }
    });
    const body = {
      gameName: gameName,
      sectionName: section,
      sceneName: scene,
      dialogue: text,
    };
    // 动态上传用户输入内容
    request.post("/api/editor/editUiScene/dialogue", body).then((resp: any) => {
      // console.log("===保存场景内容==>", resp.data.data);
    });
  }, 800);

  const handleCustomPaste = (
    editor: IDomEditor,
    event: ClipboardEvent
  ): boolean => {
    const data = event.clipboardData?.getData("text/plain");
    // let plainHTML = event.clipboardData?.getData("text/html");

    const { selection } = editor;
    if (data && editor && selection) {
      editor.restoreSelection();
      const linePath = selection.anchor.path;
      const line = linePath[0];
      const lineNode = SlateNode.get(editor, linePath);
      const lineText = SlateNode.string(lineNode);
      if (lineText) {
        SlateTransforms.removeNodes(editor, { at: [line] });
      }

      const datas = data.split("\n");

      let insertLine = line;
      for (let i = 0; i < datas.length; i++) {
        let text = datas[i]?.trim();
        if (i == 0 && lineText) {
          text = lineText + text;
        }
        if (text && text !== "Play") {
          const index = text.indexOf(":")
            ? text.indexOf(":")
            : text.indexOf("：");
          const role = text.substring(0, index);
          renderText(editor, text, insertLine);
          if (role) {
            renderExpression(editor, { role, lanel: "" }, insertLine);
          }
          renderPlay(editor, scene, "", insertLine);

          insertLine++;
        }
      }

      let cursorLine = insertLine;
      if (lineText) {
        cursorLine--;
      }
      const endPoint = SlateEditor.end(editor, [cursorLine]);
      SlateTransforms.select(editor, endPoint);
    }

    event.preventDefault();
    return false;
  };

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
    const t = editorRef.current?.getText();
    let currentTextHash = "";
    if (t) {
      currentTextHash = calculateHash(t);
      // console.log(`Hash|${t} | ${textHash} | ${currentTextHash} `);
    }
    if (initTextHash === currentTextHash) {
      return;
    }
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
    customPaste: handleCustomPaste,
    EXTEND_CONF: {
      customEditotConfig: {
        addExpression,
        selectUiExpression,
        checkExpression,
        playUiLine,
        editorType: "ui",
      },
    },
  };
  return (
    <div id="ui-editor" className="ui body">
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

export default CustomUiEditor;
