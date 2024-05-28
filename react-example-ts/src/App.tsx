// import React from 'react';
// import logo from './logo.svg';
import "./App.css";

// import WebSocket from './components/WebSocket'
import CustomEditor from "./components/CustomEditor";
import CustomTextEditor from "./components/CustomTextEditor";

function App() {
  return (
    <>
      {/* <CustomEditor /> */}
      <CustomTextEditor />
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
