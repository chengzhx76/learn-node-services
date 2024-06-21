/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { TextCommandPanelElement } from './custom-types'

/*

<span class="command-panel">
  <div class="show-panel">
    <span class="show-btn">+</span>
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
    const { icon, label, command } = list[i]
    btns += `
    <button class="command">
      <img class="icon" src="${icon}" alt="${label}">
      <span class="label">${label}</span>
    </button>`
  }
  const listStr = encodeURIComponent(JSON.stringify(list))
  const html = `
    <span class="command-panel" data-w-e-type="textcommand" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline>
      <div class="show-btn">
        <span class="icon-img">+</span>
      </div>
      <div class="commands hide">${btns}</div>
    </span>`
  return html
}

// 配置
const textcommandPanelElemToHtmlConf = {
  type: 'textcommand',
  elemToHtml: textcommandPanelToHtml,
}

export {
  textcommandPanelElemToHtmlConf,
}