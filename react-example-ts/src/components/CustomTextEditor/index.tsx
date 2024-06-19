import "@wangeditor/editor/dist/css/style.css";
import "./style.css";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import { debounce, throttle } from "lodash";
import {
  IDomEditor,
  IEditorConfig,
  Boot,
  SlateTransforms,
} from "@wangeditor/editor";

import texteditorModule, { commandPanelNode } from "../../module/texteditor";
Boot.registerModule(texteditorModule);

function CustomTextEditor() {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");

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

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;
    addShowCommandPanelEvent();
  };
  const insertText = () => {
    if (editor == null) return;
    editor.insertText("dd");
  };

  return (
    <>
      <div
        id="text-editor"
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
      <button onClick={insertText}>insertText</button>
    </>
  );
}

export default CustomTextEditor;
