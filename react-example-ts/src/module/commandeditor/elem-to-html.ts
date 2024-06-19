/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { TextCommandPanelElement, TextLabelElement } from './custom-types'

/*

<span class="command-panel">
  <div class="show-panel">
    <span class="icon-show">+</span>
  </div>
  <div class="commands">
    <button class="command">插入旁白</button>
    <button class="command">插入立绘图片</button>
    <button class="command">插入背景图片</button>
    <button class="command">插入对话</button>
    <button class="command">结束游戏</button>
  </div>
</span>
*/
// 生成 html 的函数
function textcommandPanelToHtml(elem: SlateElement, childrenHtml: string): string {
  const { list = [] } = elem as TextCommandPanelElement
  let btns = ''
  for (let i = 0; i < list.length; i++) {
    const { label, command } = list[i]
    btns += `<button class="command">${label}</button>`
  }
  const listStr = encodeURIComponent(JSON.stringify(list))
  const html = `<span class="command-panel" data-w-e-type="textcommand" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline><div class="show-panel"><span class="icon-show">+</span></div><div class="commands">${btns}</div></span>`
  return html
}

// 配置
const textcommandPanelElemToHtmlConf = {
  type: 'textcommand',
  elemToHtml: textcommandPanelToHtml,
}

// 生成 html 的函数
function textlabelToHtml(elem: SlateElement, childrenHtml: string): string {
  const { value = '' } = elem as TextLabelElement
  const html = `<span data-w-e-type="textlabel" data-label="${value}" data-w-e-is-void data-w-e-is-inline>${value}</span>`
  return html
}

// 配置
const textlabelElemToHtmlConf = {
  type: 'textlabel',
  elemToHtml: textlabelToHtml,
}

export {
  textcommandPanelElemToHtmlConf,
  textlabelElemToHtmlConf,
}