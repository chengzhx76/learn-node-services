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

import texteditorModule, { commandPanelNode } from "../../module/texteditor";
Boot.registerModule(texteditorModule);

function CustomTextEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      customEditotConfig: {
        addTextCommandPanel,
      },
    },
  };

  function addTextCommandPanel() {
    if (editorRef.current) {
      editorRef.current.restoreSelection();
      SlateTransforms.insertNodes(editorRef.current, commandPanelNode);
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
      addTextCommandPanel();
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
      <button onClick={addTextCommandPanel}>insertTextCommand</button>
    </>
  );
}

export default CustomTextEditor;
