/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { TextCommandElement } from './custom-types'

/*
<ul class="commands">
  <li>插入旁白</li>
  <li>插入立绘图片</li>
  <li>插入背景图片</li>
  <li>插入背景音乐</li>
  <li>插入对话</li>
  <li>切换转场</li>
  <li>结束游戏</li>
</ul>
*/
// 生成 html 的函数
function textcommandToHtml(elem: SlateElement, childrenHtml: string): string {
  const { list = [] } = elem as TextCommandElement
  let lis = ''
  for (let i = 0; i < list.length; i++) {
    const { label, command } = list[i]
    lis += `<li>${label}</li>`
  }
  const listStr = encodeURIComponent(JSON.stringify(list))
  const html = `<div class="command-panel" data-w-e-type="textcommand" data-list="${listStr}" data-w-e-is-void data-w-e-is-inline><span onClick="showCommand">+</span><ul class="commands">${lis}</ul></div>`
  return html
}

// 配置
const textcommandElemToHtmlConf = {
  type: 'textcommand', // 节点 type ，重要！！！
  elemToHtml: textcommandToHtml,
}

export {
  textcommandElemToHtmlConf,
}