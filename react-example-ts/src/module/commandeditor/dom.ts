import { debounce } from "lodash";  
export const addShowCommandPanelEvent = debounce(() => {
  const editorDome = document.getElementById("text-editor");
  editorDome?.querySelectorAll("p").forEach((line) => {
    line.addEventListener("mouseover", () => {
      const showIconDom = line.querySelector(".icon-img");
      if (showIconDom) {
        showIconDom.className = "icon-img";
      }
    });

    line.addEventListener("mouseout", () => {
      const showIconDom = line.querySelector(".icon-img");
      if (showIconDom) {
        showIconDom.className = "icon-img hide";
      }
    });
  });
}, 500);

export const tagglePlaceholder = debounce((isShow: boolean) => {
  const placeholderDoms = document.querySelectorAll("div#text-editor div.w-e-text-placeholder");
  if (placeholderDoms.length > 0) {
     const placeholderDom = placeholderDoms[0] as HTMLElement
     placeholderDom.style.display = isShow ? "block":"none";
  }
}, 200);

export const moveCommandPanel = (line?: number) => {
  const lineDoms = document.querySelectorAll("div#text-editor p");
  // console.log('moveCommandPanel.line', line);
  if (lineDoms.length > 0) {
    if (line === undefined) {
      for (let i = 0; i < lineDoms.length; i++) {
        moveCommandPanelDom(lineDoms, i);
      }
    } else {
      moveCommandPanelDom(lineDoms, line)
    }
  }
};

const moveCommandPanelDom = (lineDoms: NodeListOf<ParentNode>, line: number) => {
  // console.log('moveCommandPanelDom===>', line);
  if (line < 0 || line >= lineDoms.length) {
    return;
  }
  const lineDom = lineDoms[line];
  if (!lineDom) {
    return;
  }
  // console.log('moveCommandPanelDom2===>', line);
  const commandPanelDom = lineDom.querySelector('.command-panel');
  if (lineDom && commandPanelDom) {
    // 从当前位置移除command-panel
    const parentSpanDom = commandPanelDom.parentNode;
    if (parentSpanDom) {
      parentSpanDom.removeChild(commandPanelDom);
    }
    // 将command-panel移动到<p>元素的第一个位置
    lineDom.insertBefore(commandPanelDom, lineDom.firstChild);

    // 为<p>元素增加position: relative;样式
    // lineDom.style.position = 'relative';
  }
};

export const showCommandPanel = (line: number) => { 
  const commandPanelDoms = document.querySelectorAll("#text-editor .command-panel");
  if (line < 0 || line >= commandPanelDoms.length) {
    return;
  }
  const commandPanelDom = commandPanelDoms[line];
  
  if (!commandPanelDom) {
    return;
  }
  const panelDom = commandPanelDom.querySelector('.panel');
  if (panelDom) { 
    panelDom.className = "panel";
  }
}
export const hideCommandPanel = (line: number) => { 
  const commandPanelDoms = document.querySelectorAll("#text-editor .command-panel");
  if (line < 0 || line >= commandPanelDoms.length) {
    return;
  }
  const commandPanelDom = commandPanelDoms[line];
  if (!commandPanelDom) {
    return;
  }
  const panelDom = commandPanelDom.querySelector('.panel');
  if (panelDom) { 
    panelDom.className = "panel hide";
  }
}