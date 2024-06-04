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

import texteditorModule, { TextCommandElement } from "../../module/texteditor";
Boot.registerModule(texteditorModule);

function addTextCommand(editor: IDomEditor) {
  console.log("====>addTextCommand");
  const { selection } = editor;
  const commandNode: TextCommandElement = {
    type: "textcommand",
    list: [
      {
        label: "插入旁白",
        command: "插入旁白:",
      },
      {
        label: "插入立绘图片",
        command: "插入立绘图片:",
      },
      {
        label: "结束游戏",
        command: "结束游戏",
      },
    ],
    children: [{ text: "" }],
  };

  if (editor && selection) {
    editor.restoreSelection(); // 恢复选区
  }
}

function CustomTextEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      textEditotConfig: {
        addTextCommand,
      },
    },
  };

  function insertTextCommand() {
    const commandNode: TextCommandElement = {
      type: "textcommand",
      list: [
        {
          label: "插入旁白",
          command: "旁白:",
        },
        {
          label: "插入立绘图片",
          command: "立绘图片:",
        },
        {
          label: "结束游戏",
          command: "结束游戏",
        },
      ],
      children: [{ text: "" }],
    };

    if (editorRef.current) {
      editorRef.current.restoreSelection(); // 恢复选区
      /* SlateTransforms.insertNodes(editor, commandNode, {
        at: editor.selection?.anchor.path,
      }); */
      SlateTransforms.insertNodes(editorRef.current, commandNode);

      /* SlateTransforms.move(editorRef.current, {
        distance: 3,
        unit: "word",
        reverse: true,
      }); */

      /* const block = SlateEditor.above(editorRef.current, {
        match: (n) => SlateEditor.isBlock(editorRef.current, n),
      });

      if (!block) return;

      const [, blockPath] = block; */

      /* const endBlockPath = SlateEditor.end(
        editorRef.current,
        editor.selection?.anchor.path
      );
      SlateTransforms.select(editorRef.current, endBlockPath); */

      const end = SlateEditor.end(editorRef.current, []);
      // SlateTransforms.select(editorRef.current, end);
      editorRef.current.select(end);
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
    setEditor(_editor);
    editorRef.current = _editor;
    setTimeout(() => {
      insertTextCommand();
    }, 500);
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
          zIndex: 100,
          width: "50%",
          marginLeft: "200px",
        }}
      >
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
      <button onClick={insertTextCommand}>insertTextCommand</button>
    </>
  );
}

export default CustomTextEditor;
