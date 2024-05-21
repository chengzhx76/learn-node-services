/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { UiEditorElement } from './custom-types'

/*
<select>
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
</select>
*/
// 生成 html 的函数
function uieditorToHtml(elem: SlateElement, childrenHtml: string): string {
  const { role = '', list = [] } = elem as UiEditorElement
  const listStr = encodeURIComponent(JSON.stringify(list))
  let option = ''
  for (let i = 0; i < list.length; i++) {
    const { value, label } = list[i]
    option = option + `<option value="${value}">${label}</option>`
  }
  const html = `<span data-w-e-type="uieditor" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline"><select>${option}</select></span>`
  // const html = `<span data-w-e-type="uieditor" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline">${role}</span>`
  return html
}

// 配置
const elemToHtmlConf = {
  type: 'uieditor', // 节点 type ，重要！！！
  elemToHtml: uieditorToHtml,
}

export default elemToHtmlConf