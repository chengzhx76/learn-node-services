/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { UiExpressionElement, UiPlayElement } from './custom-types'

/*
<select>
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
</select>
*/
// 生成 html 的函数
function uiexpressionToHtml(elem: SlateElement, childrenHtml: string): string {
  const { role = '', selected = '', list = [] } = elem as UiExpressionElement
  let option = ''
  for(const data of list) {
    const { value, label } = data;
    let isSelected = value === selected
    if (isSelected) {
      // option = option + `<option value="${value}" ${isSelected?? 'selected'}>${label}</option>`
      option = option + `<option value="${value}" selected>${label}</option>`
    } else {
      option = option + `<option value="${value}">${label}</option>`
    }
  }
  const listStr = encodeURIComponent(JSON.stringify(list))
  // const html = `<span data-w-e-type="uiexpression" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline"><select>${option}</select></span>`
  const html = `<select data-w-e-type="uiexpression" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline>${option}</select>`
  return html
}

// 生成 html 的函数
function uiplayToHtml(elem: SlateElement, childrenHtml: string): string {
  const { line, sceneName } = elem as UiPlayElement
  const html = `<span class="ui-play" data-w-e-type="uiplay" data-line="${line}" data-scene="${sceneName}" data-w-e-is-void data-w-e-is-inline">Play</span>`
  return html
}

// 配置
const uiexpressionElemToHtmlConf = {
  type: 'uiexpression', // 节点 type ，重要！！！
  elemToHtml: uiexpressionToHtml,
}
const uiplayElemToHtmlConf = {
  type: 'uiplay',
  elemToHtml: uiplayToHtml,
}

export {
  uiexpressionElemToHtmlConf,
  uiplayElemToHtmlConf,
}