/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { TextCommandPanelElement, TextPlayElement } from './custom-types'

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
      <i class="label">${label}</i>
    </button>`
  }
  const listStr = encodeURIComponent(JSON.stringify(list))
  const html = `
    <span class="command-panel" data-w-e-type="textcommand" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline>
      <div class="show-btn">
        <strong class="icon-img">+</strong>
      </div>
      <div class="panel hide">
        <div class="commands">${btns}</div>
      </div>
    </span>`
  return html
}

function textplayToHtml(elem: SlateElement, childrenHtml: string): string {
  const { line, sceneName } = elem as TextPlayElement
  const html = `<strong class="text-play" data-w-e-type="textplay" data-line="${line}" data-scene="${sceneName}" data-w-e-is-void data-w-e-is-inline">Play</strong>`
  return html
}

// 配置
const textcommandPanelElemToHtmlConf = {
  type: 'textcommand',
  elemToHtml: textcommandPanelToHtml,
}

const textplayElemToHtmlConf = {
  type: 'textplay',
  elemToHtml: textplayToHtml,
}

export {
  textcommandPanelElemToHtmlConf,
  textplayElemToHtmlConf,
}