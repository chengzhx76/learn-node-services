import "@wangeditor/editor/dist/css/style.css";
import "./style.css";
import "./layout.css";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import {
  IDomEditor,
  IEditorConfig,
  Boot,
  SlateTransforms,
} from "@wangeditor/editor";
import type { UploadProps } from "antd";
import { Upload } from "antd";

import request from "../../util/request";
import { debounce } from "../../util";

import commandeditorModule from "../../module/commandeditor";
Boot.registerModule(commandeditorModule);

const gameName = "cheng-t";

console.log("init CustomCommandEditor.test");

function CustomCommandEditor() {
  // editor 实例
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

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      console.log("destroy.CustomCommandEditor");
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [editor]);

  useEffect(() => {
    renderContent();
    sessionStorage.setItem("__sectionName", section);
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

    // setHtml("");
    setOpenMask(true);
    request.post("/api/editor/sceneDetail", body).then((resp: any) => {
      const list = resp.data.data;
      if (list && editorRef.current) {
        editorRef.current.restoreSelection();
        editorRef.current.clear();

        let html = "";
        for (const line of list) {
          html += `<p>${line.desc}</p>`;
        }
        // console.log("=====html===>", html);
        if (html) {
          /* editorRef.current?. */ setHtml(html);
        }
        /* setTimeout(() => {
          if (editorRef.current) {
            const end = SlateEditor.end(editorRef.current, []);
            SlateTransforms.select(editorRef.current, end);
          }
        }, 100); */
        setOpenMask(false);
      }
    });
  }

  // 清空内容
  const clearRender = () => {
    if (editorRef.current) {
      // editorRef.current.clear();
      // editorRef.current.setHtml("");
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
      // console.log("info", info.file.response);
      if (!resp) {
        return;
      }
      setOpenMask(true);
      if (info.file.status === "done") {
        if (editorRef.current) {
          if (resp && resp.code !== 200) {
            editorRef.current.alert(resp.msg, "error");
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
            }, 200);
          }

          /* editorRef.current.restoreSelection();
          editorRef.current.setHtml("");
          let html = "";
          for (const line of list) {
            // renderText(editorRef.current, list[i].desc, i);
            html += `<p>${line.desc}</p>\n`;
          }
          editorRef.current.setHtml(html); */
          setOpenMask(false);
        }
      }
    },
  };

  const putTextEditorText = debounce(() => {
    const sectionName = sessionStorage.getItem("__sectionName");
    const body = {
      gameName: gameName,
      sectionName: sectionName,
      text: editorRef.current?.getText(),
    };
    request.post("/api/editor/editTxtScene", body).then((resp: any) => {
      // console.log('===保存场景内容==>', resp.data.data);
    });
  }, 800);

  const undoText = () => {
    if (editor != null && editor.undo) {
      editor.undo();
      setTimeout(() => {
        putTextEditorText();
      }, 200);
    }
  };

  const redoText = () => {
    if (editor != null && editor.redo) {
      editor.redo();
      setTimeout(() => {
        putTextEditorText();
      }, 200);
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
      const p = { type: "paragraph", children: [{ text: command }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      customEditotConfig: {
        putTextEditorText,
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
        {/* 南海观音大战孙猴子|text
        <br />
        <input
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="Type your section"
        />
        <br /> */}
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
