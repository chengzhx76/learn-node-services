import { debounce } from "lodash";  

export function setWarnState(line: number, isWarn: boolean) { 
  const id = `#expression_${line}`
  const expressionDom = document.getElementById(id);
  console.log('setWarnState=============> ', id, expressionDom);
  if (expressionDom) { 
    expressionDom.className = isWarn ? "ui-expression warn" : "ui-expression";
  }
}

export function checkExpression() { 
  const expressionDoms = document.querySelectorAll("#ui-editor .ui-expression");
  if (expressionDoms && expressionDoms.length > 0) {
    for (let i = 0; i < expressionDoms.length; i++) {
      const expressionDom = expressionDoms[i] as HTMLSelectElement;
      if (expressionDom) {
        const exVal = expressionDom.value;
        if ('无立绘' === exVal) {
          expressionDom.className = "ui-expression warn";
        }
      }
    }
  }
}