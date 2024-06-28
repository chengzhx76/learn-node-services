import { debounce } from "lodash";  

export function setUiPlayStyle() {
  const uiPayDoms = document.querySelectorAll("#ui-editor .ui-play");
  if (uiPayDoms && uiPayDoms.length > 0) {
    for (let i = 0; i < uiPayDoms.length; i++) {
      const uiPayDom = uiPayDoms[i];
      if (uiPayDom && uiPayDom.parentNode) {
        let warpDom = uiPayDom.parentNode as HTMLElement;
        warpDom.className = "warp-ui-play";
      }
    }
  }
}

export function checkStandard() { 
  const expressionDoms = document.querySelectorAll("#ui-editor .ui-expression");
  if (expressionDoms && expressionDoms.length > 0) {
    for (let i = 0; i < expressionDoms.length; i++) {
      const expressionDom = expressionDoms[i] as HTMLSelectElement;
      if (expressionDom) {
        expressionDom.className = '无立绘' === expressionDom.value ? "ui-expression warn": "ui-expression";
      }
    }
  }
}

export function getText() { 
  const lineDoms = document.querySelectorAll("div.w-e-text-container p");
  const scenes = [];
  for (let lineDom of lineDoms) {
    const selectDom = lineDom.querySelector("select");
    let expression = "";
    if (selectDom) {
      expression = selectDom.value;
    }

    const playDom = lineDom.querySelector(".ui-play");
    let line = "";
    if (playDom && playDom.hasAttribute("data-line")) {
      line = playDom.getAttribute("data-line") as string;
    }

    let text = getChildNodesText(lineDom.childNodes);

    scenes.push({
      expression,
      text,
      line,
    });
  }
  return scenes
}

function getChildNodesText(nodes: NodeListOf<ChildNode>, texts: string[] = []) {
  for (let node of nodes) {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.parentElement &&
      node.parentElement.tagName.toLowerCase() === "span"
    ) {
      const content = node.textContent?.trim();
      if (content) {
        texts.push(content);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      getChildNodesText(node.childNodes, texts);
    }
  }
  return texts.join("");
}