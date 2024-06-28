import "@wangeditor/editor/dist/css/style.css";
import "./style.css";
import "./layout.css";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import {
  Boot,
  IDomEditor,
  SlateEditor,
  SlateNode,
  IEditorConfig,
  DomEditor,
  SlateTransforms,
} from "@wangeditor/editor";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { debounce } from "lodash";

import request from "../../util/request";
import { getEditorNode } from "../../module/utils";
import { calculateHash, randomCode } from "../../util";

import commandeditorModule, {
  commands,
  commandLabels,
  hideCommandPanel,
  getText,
  addShowCommandPanelEvent,
  tagglePlaceholder,
  setCommandPanelStyle,
  setTextPlayStyle,
  TextCommandPanelElement,
  TextPlayElement,
} from "../../module/commandeditor";
Boot.registerModule(commandeditorModule);

const gameName = "cheng-t";

let initFinish = false;
let textHash = "";
function CustomCommandEditor() {
  const [section, setSection] = useState<string>("text");
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");
  const [loadingMask, setLoadingMask] = useState(false);
  const [panelMask, setPanelMask] = useState(false);

  useEffect(() => {
    // @ts-ignore
    window["editorMode"] = "text";
    renderContent();
  }, [section]);

  function renderSection(sectionName: string) {
    setSection(sectionName);
  }

  function renderContent() {
    if (!section) {
      return;
    }
    const body = {
      gameName: gameName,
      sectionName: section,
      sceneType: "editor",
    };

    initFinish = false;
    setLoadingMask(true);
    request.post("/api/editor/sceneDetail", body).then((resp: any) => {
      const data = resp.data.data;
      if (data && editorRef.current) {
        editorRef.current.restoreSelection();
        editorRef.current.clear();
        renderScene(editorRef.current, data.texts, section);
      }
    });
  }

  function renderScene(_editor: IDomEditor, list: any, section: string) {
    if (!_editor) {
      return;
    }
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const line = list[i];
        let text = line.desc;

        renderText(_editor, text, i);
        renderCommandPanel(_editor, i);
        if (text) {
          renderPlay(_editor, section, line.sentence, i);
        }
      }
      renderCommandPanel(_editor, list.length);
    } else {
      renderCommandPanel(_editor, 0);
      tagglePlaceholder(true);
    }
    setTimeout(() => {
      calculateTextHash();
      setLoadingMask(false);
      initFinish = true;
    }, 300);
  }

  function renderText(_editor: IDomEditor, text: string, i: number) {
    const p = { type: "paragraph", children: [{ text: text }] };
    SlateTransforms.insertNodes(_editor, p, {
      at: [i],
      mode: "highest",
    });
  }

  const renderCommandPanel = (_editor: IDomEditor, i: number) => {
    const commandPanelNode: TextCommandPanelElement = {
      type: "textcommand",
      list: commands,
      children: [{ text: "" }],
    };
    SlateTransforms.insertNodes(_editor, commandPanelNode, {
      at: [i, 0],
    });
  };

  function renderPlay(
    _editor: IDomEditor,
    section: string,
    line: string,
    i: number
  ) {
    let _line = line;
    if (!line) {
      _line = randomCode();
    }
    const playNode: TextPlayElement = {
      type: "textplay",
      line: line,
      sceneName: section,
      children: [{ text: "" }],
    };
    SlateTransforms.insertNodes(_editor, playNode, {
      at: [i, 0],
    });
  }

  function addTextPlay(_editor: IDomEditor, line?: number) {
    if (_editor) {
      _editor.restoreSelection();
      const { selection } = _editor;
      if (!selection && line === undefined) {
        return;
      }
      let linePath = selection?.anchor.path;
      if (line !== undefined) {
        linePath = [line];
      }
      if (!linePath) {
        return;
      }

      const node = getEditorNode("textplay", _editor);
      if (node) {
        return;
      }

      const playNode: TextPlayElement = {
        type: "textplay",
        line: randomCode(),
        sceneName: "section",
        children: [{ text: "" }],
      };
      SlateTransforms.insertNodes(_editor, playNode, { at: [linePath[0], 0] });
    }
  }

  function tagglePanelMask(show: boolean) {
    setPanelMask(show);
  }

  function hideCommandPanelAndMask() {
    setPanelMask(false);
    hideCommandPanel();
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
      textHash = calculateHash(t);
    }, 1200);
  };

  // 清空内容
  const clearRender = () => {
    if (editorRef.current) {
      setHtml("");
    }
  };

  const uploadText: UploadProps = {
    name: "file",
    action: "/api/editor/editTxtScene/upload",
    accept: "txt, text/plain",
    data: {
      gameName: gameName,
      sectionName: section,
    },
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTkzODM2NDgsImV4cCI6MTcxOTQ3MDA0OH0.XuSwoH7oTPdDxRz131akkO_a-ZJtkQFW88hOL4z5SOo`,
    },
    showUploadList: false,
    onChange(info) {
      const resp = info.file.response;
      if (!resp) {
        return;
      }
      setLoadingMask(true);
      if (info.file.status === "done") {
        if (editorRef.current) {
          if (resp && resp.code !== 200) {
            editorRef.current.alert(resp.msg, "error");
            initFinish = true;
            setLoadingMask(false);
            return;
          }
          const list = info.file.response.data;
          if (list && list.length === 0) {
            return;
          }

          editorRef.current.restoreSelection();
          editorRef.current.clear();

          renderScene(editorRef.current, list.texts, section);
          setTimeout(() => {
            initFinish = true;
            setLoadingMask(false);
          }, 200);
        }
      }
    },
  };

  const putTextEditorText = debounce((_section: string) => {
    const scenes = getText();
    let text = "";
    scenes.forEach((scene) => {
      if (scene.text) {
        text += `${scene.line}|${scene.text}\n`;
      } else {
        text += "\n";
      }
    });

    const body = {
      gameName: gameName,
      sectionName: _section,
      text: text,
    };
    request.post("/api/editor/editTxtScene", body).then((resp: any) => {
      // console.log('===保存场景内容==>', resp.data.data);
    });
  }, 800);

  function playTextLine(sceneName: string, line: string) {
    if (!line) {
      return;
    }
    const body = {
      gameName: gameName,
      sectionName: section,
      sceneName: sceneName,
    };
    request
      .post(`/api/editor/scene/command/${line}`, body)
      .then((resp: any) => {
        const data = resp.data.data;
        console.log("playTextLine===>", data);
      });
  }

  /* function addTextCommandShowPanel(line: number) {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const commandPanelNode: TextCommandPanelElement = {
        type: "textcommand",
        list: commands,
        children: [{ text: "" }],
      };
      SlateTransforms.insertNodes(editorRef.current, commandPanelNode, {
        at: [line, 0],
      });
    }
  } */

  function addTextCommandShowPanel(line: number) {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const playNode: TextPlayElement = {
        type: "textplay",
        line: randomCode(),
        sceneName: "section",
        children: [{ text: "" }],
      };
      SlateTransforms.insertNodes(editorRef.current, playNode, {
        at: [line, 0],
      });
    }
  }

  const undoText = () => {
    const t = editorRef.current?.getText();
    let currentTextHash = "";
    if (t) {
      currentTextHash = calculateHash(t);
      console.log(`Hash|${t} | ${textHash} | ${currentTextHash} `);
    }
    if (textHash === currentTextHash) {
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

  const insertHtml = () => {
    if (editor == null) return;
    const html = `<p>我是html</p>`;
    setHtml(html);
  };

  const handleCustomPaste = (
    editor: IDomEditor,
    event: ClipboardEvent
  ): boolean => {
    let data = event.clipboardData?.getData("text/plain");
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

      const texts = [];
      let insertLine = line;
      for (let i = 0; i < datas.length; i++) {
        let text = datas[i]?.trim();
        if (i == 0 && lineText) {
          text = lineText + text;
        }
        if (
          text &&
          !commandLabels.includes(text) &&
          text !== "+" &&
          text !== "Play"
        ) {
          texts.push({
            desc: text,
          });
          renderText(editor, text, insertLine);
          renderCommandPanel(editor, insertLine);
          renderPlay(editor, section, "", insertLine);
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

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      editorRef.current?.destroy();
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
    setTextPlayStyle();
    setCommandPanelStyle();
    addShowCommandPanelEvent();
    if (initFinish) {
      putTextEditorText(section);
    }
    const t = _editor.getText();
    tagglePlaceholder(!t.trim());
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    customPaste: handleCustomPaste,
    EXTEND_CONF: {
      customEditotConfig: {
        addTextPlay,
        playTextLine,
        tagglePanelMask,
        editorType: "text",
      },
    },
  };

  return (
    <div className="text body">
      {loadingMask && <div className="mask" />}
      {panelMask && <div className="mask" onClick={hideCommandPanelAndMask} />}
      {/* {左侧栏} */}
      <div className="sidebar fixed-sidebar-left">
        <h1>Text编辑器</h1>
        <button onClick={insertHtml}>insertHtml</button>
        <br />
        <button onClick={undoText}>撤销</button>
        <br />
        <button onClick={redoText}>重做</button>
        <br />
        <button onClick={() => addTextCommandShowPanel(2)}>
          addTextCommandShowPanel
        </button>
        <br />
        <Upload {...uploadText} className="uploadtxt">
          <button>上传txt</button>
        </Upload>
        {/* <div style={{ marginTop: "15px" }}>{html}</div> */}
      </div>

      {/* {中间区域} */}
      <div className="main-content">
        <div id="text-editor" className="editor">
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
        <h3>{section}</h3>
        <button onClick={() => renderSection("南海观音大战孙猴子")}>
          渲染(南海观音大战孙猴子)
        </button>
        <br />
        <button onClick={() => renderSection("text")}>渲染(text)</button>
        <br />
        <button onClick={() => clearRender}>清空渲染</button>
      </div>
    </div>
  );
}

export default CustomCommandEditor;
