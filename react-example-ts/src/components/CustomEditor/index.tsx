import "@wangeditor/editor/dist/css/style.css";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, Boot } from "@wangeditor/editor";
import mentionModule, { MentionElement } from "../../module/mention";
import uieditorModule, { UiEditorElement } from "../../module/uieditor";
Boot.registerModule(mentionModule);
Boot.registerModule(uieditorModule);

// 显示弹框
function showModal(editor: IDomEditor) {
  console.log("====>showModal");
}
// 隐藏弹框
function hideModal(editor: IDomEditor) {
  console.log("====>showModal");
}

function addPay(editor: IDomEditor) {
  console.log("====>addPay");
}

// 隐藏弹框
function addExpression(editor: IDomEditor) {
  console.log("====>addExpression");
}

function CustomEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState("");

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    EXTEND_CONF: {
      uiEditotConfig: {
        addPay, // 必须
        addExpression, // 必须
      },
      mentionConfig: {
        showModal,
        hideModal,
      },
    },
  };

  function insertMention() {
    const mentionNode: MentionElement = {
      type: "mention", // 必须是 'mention'
      value: "张三", // 文本
      info: { x: 1, y: 2 }, // 其他信息，自定义
      children: [{ text: "" }], // 必须有一个空 text 作为 children
    };

    if (editor) {
      editor.restoreSelection(); // 恢复选区
      // editor.deleteBackward("character"); // 删除 '@'
      editor.insertNode(mentionNode); // 插入 mention
      // editor.move(1); // 移动光标
    }
  }

  function insertUiEditor() {
    const mentionNode: UiEditorElement = {
      type: "uieditor",
      role: "Role-he",
      list: [
        {
          label: "哈哈",
          value: "1",
        },
        {
          label: "呵呵",
          value: "2",
        },
      ],
      children: [{ text: "" }],
    };

    if (editor) {
      editor.restoreSelection(); // 恢复选区
      editor.insertNode(mentionNode); // 插入 mention
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
    console.log("handleCreated", _editor);
    setEditor(_editor);
    editorRef.current = _editor;

    // console.log("created.global.editor", editor, editorRef.current);
  };

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;
    console.log("handleChange.getHtml()", _editor.getHtml());
  };

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={handleCreated}
          onChange={handleChange}
          mode="default"
          style={{ height: "300px", overflowY: "hidden" }}
        />
      </div>
      <div style={{ marginTop: "15px" }}>{html}</div>
      <button onClick={insertMention}>insertMention</button>
      <button onClick={insertUiEditor}>insertUiEditor</button>
    </>
  );
}

export default CustomEditor;
