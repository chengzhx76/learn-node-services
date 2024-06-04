import "@wangeditor/editor/dist/css/style.css";
import "./style.css";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import {
  IDomEditor,
  IEditorConfig,
  Boot,
  SlateTransforms,
  SlateEditor,
} from "@wangeditor/editor";

import commandeditorModule from "../../module/commandeditor";
Boot.registerModule(commandeditorModule);

function addCommand(editor: IDomEditor) {
  console.log("====>addCommand");
}

function CustomCommandEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");
  const [show, setShow] = useState(false);
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

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      commandEditotConfig: {
        addCommand,
      },
    },
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

  /* function insertIntro() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: "旁白:" }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  }
  function insertFigure() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: "立绘图片:" }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  }
  function insertBg() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: "背景图片:" }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  }
  function insertBgm() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: "背景音乐:" }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  }
  function insertDialog() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: "对话:" }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  }
  function insertCallScene() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: "切换转场:" }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  }
  function insertEnd() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      const p = { type: "paragraph", children: [{ text: "结束游戏" }] };
      if (editor) {
        SlateTransforms.insertNodes(editor, p, {
          mode: "highest",
        });
      }
    }
  } */

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
    setEditor(_editor);
    editorRef.current = _editor;
  };

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;

    // console.log(_editor.getHtml());
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #ccc",
          width: "50%",
          marginLeft: "200px",
        }}
      >
        <div className="add-command">
          <a
            className="add-icon"
            href="javascript:void(0);"
            onClick={() => setShow(!show)}
          >
            <img className="img" src="/icon/add.png" />
          </a>
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
                    <img className="icon" src={command.icon} />
                    <a
                      href="javascript:void(0);"
                      className="command"
                      onClick={() => insertCommand(command.command)}
                    >
                      {command.label}
                    </a>
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
          mode="default"
          style={{ height: "300px" }}
        />
      </div>
      <div style={{ marginTop: "15px" }}>{html}</div>
    </>
  );
}

export default CustomCommandEditor;
