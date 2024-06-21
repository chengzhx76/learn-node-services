import "@wangeditor/editor/dist/css/style.css";
import "./style.css";
import "./layout.css";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import {
  Boot,
  IDomEditor,
  IEditorConfig,
  SlateTransforms,
} from "@wangeditor/editor";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { debounce } from "lodash";

import request from "../../util/request";
import { calculateHash } from "../../util";

import commandeditorModule, {
  commands,
  TextCommandPanelElement,
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
  const [show, setShow] = useState(false);
  const [openMask, setOpenMask] = useState(false);

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [editor]);

  useEffect(() => {
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
    setOpenMask(true);
    request.post("/api/editor/sceneDetail", body).then((resp: any) => {
      const data = resp.data.data;
      if (data && editorRef.current) {
        editorRef.current.restoreSelection();
        editorRef.current.clear();
        renderScene(editorRef.current, data.texts);
      }
      setTimeout(() => {
        initFinish = true;
        setOpenMask(false);
        calculateTextHash();
      }, 300);
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
      textHash = calculateHash(t);
    }, 1500);
  };

  function renderScene(_editor: IDomEditor, list: any) {
    if (!_editor) {
      return;
    }
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const line = list[i];
        let text = line.desc;

        renderText(_editor, text, i);
        renderCommandPanel(_editor, i);
      }
    } else {
      renderCommandPanel(_editor, 0);
    }
    setTimeout(() => {
      initFinish = true;
      calculateTextHash();
      setOpenMask(false);
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
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTg5NDA2MzQsImV4cCI6MTcxOTAyNzAzNH0.JooR667REU5bJrK9d9tx-Iubr1vVRjS9ILluWFF4tDI`,
    },
    showUploadList: false,
    onChange(info) {
      const resp = info.file.response;
      if (!resp) {
        return;
      }
      setOpenMask(true);
      if (info.file.status === "done") {
        if (editorRef.current) {
          if (resp && resp.code !== 200) {
            editorRef.current.alert(resp.msg, "error");
            initFinish = true;
            setOpenMask(false);
            return;
          }
          const list = info.file.response.data;
          if (list && list.length === 0) {
            return;
          }

          editorRef.current.restoreSelection();
          editorRef.current.clear();

          renderScene(editorRef.current, list.texts);
          setTimeout(() => {
            initFinish = true;
            setOpenMask(false);
          }, 200);
        }
      }
    },
  };

  const putTextEditorText = debounce(() => {
    const body = {
      gameName: gameName,
      sectionName: section,
      text: editorRef.current?.getText(),
    };
    request.post("/api/editor/editTxtScene", body).then((resp: any) => {
      // console.log('===保存场景内容==>', resp.data.data);
    });
  }, 800);

  function addTextCommandShowPanel(line: number) {
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
  }

  function taggleTextCommandPanel(line: number) {
    console.log("=====taggleTextCommandPanel===>", line);
  }

  const addShowCommandPanelEvent = debounce(() => {
    var editorDome = document.getElementById("text-editor");
    editorDome?.querySelectorAll("p").forEach((line) => {
      line.addEventListener("mouseover", () => {
        const showIconDom = line.querySelector(".icon-img");
        if (showIconDom) {
          showIconDom.className = "icon-img";
        }
      });

      line.addEventListener("mouseout", () => {
        const showIconDom = line.querySelector(".icon-img");
        if (showIconDom) {
          showIconDom.className = "icon-img hide";
        }
      });
    });
  }, 500);

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

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      customEditotConfig: {
        taggleTextCommandPanel,
      },
    },
  };

  const handleCreated = (_editor: IDomEditor) => {
    if (_editor == null) return;
    setEditor(_editor);
    editorRef.current = _editor;
  };

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;
    addShowCommandPanelEvent();
    if (initFinish) {
      putTextEditorText();
    }
  };

  return (
    <div className="text body">
      {openMask && <div className="mask" />}
      {/* {左侧栏} */}
      <div className="sidebar fixed-sidebar-left">
        <h1>Text编辑器</h1>
        <button onClick={insertHtml}>insertHtml</button>
        <br />
        <button onClick={undoText}>撤销</button>
        <br />
        <button onClick={redoText}>重做</button>
        <br />
        <button onClick={() => addTextCommandShowPanel(1)}>
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
