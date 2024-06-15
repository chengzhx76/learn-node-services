import "@wangeditor/editor/dist/css/style.css";
import "./style.css";
import "./layout.css";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig } from "@wangeditor/editor";
import type { UploadProps } from "antd";
import { Upload } from "antd";

import request from "../../util/request";
import { debounce } from "../../util";

// import commandeditorModule from "../../module/commandeditor";
// Boot.registerModule(commandeditorModule);

const gameName = "cheng-t";

let initFinish = false;
function CustomCommandEditor() {
  const [section, setSection] = useState<string>("text");
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");
  const [show, setShow] = useState(false);
  const [openMask, setOpenMask] = useState(false);
  const commands = [
    {
      icon: "/icon/intro.png",
      command: "旁白",
      label: "插入旁白",
    },
    {
      icon: "/icon/figure.png",
      command: "立绘图片",
      label: "插入立绘图片",
    },
    {
      icon: "/icon/bg.png",
      command: "背景图片",
      label: "插入背景图片",
    },
    {
      icon: "/icon/bgm.png",
      command: "背景音乐",
      label: "插入背景音乐",
    },
    {
      icon: "/icon/dialog.png",
      command: "对话",
      label: "插入对话",
    },
    {
      icon: "/icon/callScene.png",
      command: "切换转场",
      label: "切换转场",
    },
    {
      icon: "/icon/end.png",
      command: "结束游戏",
      label: "结束游戏",
    },
  ];

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
        for (const line of data.texts) {
          html += `<p>${line.desc}</p>`;
        }
        if (html) {
          setTimeout(() => {
            setHtml(html);
          }, 100);
        }
      }
      setTimeout(() => {
        initFinish = true;
      }, 300);
      setOpenMask(false);
    });
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
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjMDYzMGJhOGU4ZDI1MDJhZjUwMDEiLCJ1c2VybmFtZSI6ImNoZW5nZ2MiLCJpYXQiOjE3MTgxODU3ODQsImV4cCI6MTcxODI3MjE4NH0.s7XS_2yhjCzN27BcG8sv3Ql8b62-nL_vbhOvQTCbR4A`,
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

  function insertCommand(command: string) {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      if (command !== "结束游戏") {
        command += ":";
      }
      editorRef.current.insertText(command);
    }
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
  };

  const handleCreated = (_editor: IDomEditor) => {
    if (_editor == null) return;
    setEditor(_editor);
    editorRef.current = _editor;
  };

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;
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
        <Upload {...uploadText} className="uploadtxt">
          <button>上传txt</button>
        </Upload>
        {/* <div style={{ marginTop: "15px" }}>{html}</div> */}
      </div>

      {/* {中间区域} */}
      <div className="main-content">
        <div className="editor">
          <div className="add-command">
            <div className="add-icon" onClick={() => setShow(!show)}>
              <img className="img" src="/icon/add.png" alt="icon" />
            </div>
            {show && (
              <>
                {/* <div className="mask" onClick={() => setShow(false)}></div> */}
                <div className="panel">
                  {commands.map((command, index) => (
                    <div
                      className="cell"
                      key={index}
                      onClick={() => setShow(false)}
                    >
                      <img className="icon" src={command.icon} alt="icon" />
                      <div
                        className="command"
                        onClick={() => insertCommand(command.command)}
                      >
                        {command.label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
