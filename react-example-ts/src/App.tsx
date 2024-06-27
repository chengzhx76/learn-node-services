// import React from 'react';
// import logo from './logo.svg';
import "./App.css";

import React, { useState } from "react";

// import WebSocket from "./components/WebSocket";
import CustomUiEditor from "./components/CustomUiEditor";
import CustomCommandEditor from "./components/CustomCommandEditor";
import CustomTextEditor from "./components/CustomTextEditor";

function App() {
  const [editorType, setEditorType] = useState<string>("ui");

  return (
    <>
      <div className="editor-type">
        <h3>切换编辑器类型</h3>
        <button onClick={() => setEditorType("ui")}>UI编辑器</button>
        <br />
        <button onClick={() => setEditorType("comm")}>COMM编辑器</button>
        <br />
        {/* <button onClick={() => setEditorType("text")}>TEXT编辑器</button> */}
      </div>
      {editorType === "ui" && <CustomUiEditor />}
      {editorType === "comm" && <CustomCommandEditor />}
      {/* {editorType === "panel" && <CustomPanelEditor />} */}
      {/* {editorType === "text" && <CustomTextEditor />} */}
      {/* <WebSocket /> */}
    </>
  );
}

export default App;

/*
<div className="App">
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>
      Edit <code>src/App.tsx</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </header>
</div>
*/
