import "@wangeditor/editor/dist/css/style.css";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, Boot } from "@wangeditor/editor";

// import withBreakAndDelete from './withBreakAndDelete'
// Boot.registerPlugin(withBreakAndDelete)

const scenes_text = `山音麦：不算；
山音麦：滑蛋饭；
八谷绢：对吧，他们以为他们在听同一首歌，其实不是，他们俩现在听的就不是同一首歌；
山音麦：录音棚里有这样的调音台，你见过吧；
山音麦：上面有许多开关和旋钮，它们的作用就是让左右声道的声音合在一起变得立体；
八谷绢：那些音乐家和混录师在棚里扒盒饭熬通宵，几十遍几百遍地反复比较才把音乐做出来，结果呢？他们居然把左右声道分开
        听。
山音麦：混录师知道了，不得气得把盒饭拍台子上；
八谷绢：大喊“这活儿没法干了”；
山音麦：谈恋爱就是不能分享的啊；
八谷绢：谈恋爱就是各谈各的；
山音麦：每个人谈自己的，他们不懂这个道理啊；
八谷绢：我去告诉他们吧`;

function CustomEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const editorRef = useRef<IDomEditor | null>(null);

  // 编辑器内容
  const [html, setHtml] = useState("<p>hello</p>");

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      // setHtml('<p>hello world</p>')
      textToHtml();
    }, 2500);
  }, []);

  const textToHtml = () => {
    const text = scenes_text; // text 内容
    // 1. 把 text 转换为 html
    const html = text
      .split(/\n/)
      .map((line) => `<p>${line}</p>`)
      .join("\n");
    setHtml(html);
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
  };

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
    console.log("created.editor", _editor);
    setEditor(_editor);
    editorRef.current = _editor;

    console.log("created.global.editor", editor, editorRef.current);
  };

  const handleChange = (_editor: IDomEditor) => {
    if (_editor == null) return;
    console.log("change.editor", _editor);
    console.log("change.editor.getHtml()", _editor.getHtml());
    setHtml(_editor.getHtml());
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
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
      <div style={{ marginTop: "15px" }}>{html}</div>
    </>
  );
}

export default CustomEditor;
