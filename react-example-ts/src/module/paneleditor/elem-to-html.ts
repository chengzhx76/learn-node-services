/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { TextCommandPanelElement } from './custom-types'


// 生成 html 的函数
/* function panelBtnToHtml(elem: SlateElement, childrenHtml: string): string {
  const { label = '' } = elem as PanelBtnElement
  const html = `<span data-w-e-type="panelbtn" data-line="${label}" data-w-e-is-void data-w-e-is-inline>${label}</span>`
  return html
} */

function textcommandPanelToHtml(elem: SlateElement, childrenHtml: string): string {
  const { list = [] } = elem as TextCommandPanelElement
  let btns = ''
  for (let i = 0; i < list.length; i++) {
    const { label, command } = list[i]
    btns += `<button class="command">${label}</button>`
  }
  const listStr = encodeURIComponent(JSON.stringify(list))
  const html = `<span class="command-panel" data-w-e-type="textcommand" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline><div class="show-panel"><span class="icon-show">+</span></div><div class="commands hide">${btns}</div></span>`
  return html
}

const textcommandPanelElemToHtmlConf = {
  type: 'textcommand',
  elemToHtml: textcommandPanelToHtml,
}

export {
  textcommandPanelElemToHtmlConf,
}