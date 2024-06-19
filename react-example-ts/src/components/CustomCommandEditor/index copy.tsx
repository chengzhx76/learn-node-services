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

import request from "../../util/request";
import { debounce } from "lodash";

import commandeditorModule, {
  commands,
  TextCommandPanelElement,
} from "../../module/commandeditor";
Boot.registerModule(commandeditorModule);

const commandPanelNode: TextCommandPanelElement = {
  type: "textcommand",
  list: commands,
  children: [{ text: "" }],
};

const gameName = "cheng-t";

let initFinish = false;
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

        let html = "";
        let lin = 0;
        for (const line of data.texts) {
          // html += `<p>${line.desc}</p>`;
          renderLine(editorRef.current, line.desc, lin);
          // renderText(editorRef.current, line.desc, lin);
          lin++;
        }
        /* setTimeout(() => {
          renderCommandPanel();
        }, 1000); */
        /* if (html) {
          setTimeout(() => {
            setHtml(html);
            setTimeout(() => {
              // renderCommandPanel();
            }, 1000);
          }, 100);
        } */
      }
      setTimeout(() => {
        initFinish = true;
      }, 300);
      setOpenMask(false);
    });
  }

  function renderText(editor: IDomEditor, text: string, i: number) {
    const p = { type: "paragraph", children: [{ text: text }] };
    SlateTransforms.insertNodes(editor, p, {
      at: [i],
      mode: "highest",
    });
  }

  function renderLine(editor: IDomEditor, text: string, i: number) {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: text }] };
      SlateTransforms.insertNodes(editorRef.current, p, {
        at: [i],
      });
      setTimeout((i: number) => {
        SlateTransforms.insertNodes(editor, commandPanelNode, {
          at: [i],
        });
      }, 1000);
    }
  }

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
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTg3NzY0MzUsImV4cCI6MTcxODg2MjgzNX0.eT4Lywx4Mkgf8PGrNTdSY3afYQlLkJAfRI_3t-LQyxk`,
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
          let html = "";
          for (const line of list) {
            html += `<p>${line.desc}</p>`;
          }
          if (html) {
            setTimeout(() => {
              setHtml(html);
              initFinish = true;
              setOpenMask(false);
            }, 200);
          }
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

  const getLineCount = () => {
    if (editorRef.current) {
      const totalLine = editorRef.current.children.length;
      console.log("========totalLine===> ", totalLine);
    }
  };

  const renderCommandPanel = () => {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const totalLine = editorRef.current.children.length;
      console.log("========totalLine===> ", totalLine);
      for (let i = 1; i < totalLine; i++) {
        SlateTransforms.insertNodes(editorRef.current, commandPanelNode, {
          at: [i, 0],
        });
      }
    }
  };

  function addTextCommandPanel(line: number) {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      SlateTransforms.insertNodes(editorRef.current, commandPanelNode, {
        at: [line, 0],
      });
    }
  }

  const addShowCommandPanelEvent = debounce(() => {
    var editorDome = document.getElementById("text-editor");
    editorDome?.querySelectorAll("p").forEach((line) => {
      line.addEventListener("mouseover", () => {
        const showIconDom = line.querySelector(".show-icon");
        if (showIconDom) {
          showIconDom.className = "show-icon";
        }
      });

      line.addEventListener("mouseout", () => {
        const showIconDom = line.querySelector(".show-icon");
        if (showIconDom) {
          showIconDom.className = "show-icon icon-hide";
        }
      });
    });
  }, 500);

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

  const insertHtml = () => {
    if (editor == null) return;
    const html = `<p>我是html</p>`;
    setHtml(html);
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      customEditotConfig: {},
    },
  };

  const handleCreated = (_editor: IDomEditor) => {
    if (_editor == null) return;
    setEditor(_editor);
    editorRef.current = _editor;
    setTimeout(() => {
      addTextCommandPanel(0);
    }, 500);
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
        <button onClick={getLineCount}>getLineCount </button>
        <br />
        <button onClick={renderCommandPanel}>renderCommandPanel </button>
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
