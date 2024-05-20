/**
 * @description parse elem html
 * @author wangfupeng
 * 
 * 解析新元素 HTML 到编辑器
 * 通过 const html = editor.getHtml() 可以得到正确的 HTML ，但再去设置 HTML editor.setHtml(html) 却无效。需要你自定义解析 HTML 的逻辑。
 */

import { DOMElement } from '../utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { MentionElement } from './custom-types'

/**
 * 解析 HTML 字符串，生成“@用户”元素
 * @param domElem HTML 对应的 DOM Element
 * @param children 子节点
 * @param editor editor 实例
 * @returns “@用户”元素，如上文的 myResume
 */
function parseHtml(elem: DOMElement, children: SlateDescendant[], editor: IDomEditor): SlateElement {
  // elem HTML 结构 <span data-w-e-type="mention" data-w-e-is-void data-w-e-is-inline data-value="张三" data-info="xxx">@张三</span>

  const value = elem.getAttribute('data-value') || ''
  const rawInfo = decodeURIComponent(elem.getAttribute('data-info') || '')
  let info: any
  try {
    info = JSON.parse(rawInfo)
  } catch (ex) {
    info = rawInfo
  }

  return {
    type: 'mention',
    value,
    info,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as MentionElement
}

const parseHtmlConf = {
  selector: 'span[data-w-e-type="mention"]', // CSS 选择器，匹配特定的 HTML 标签
  parseElemHtml: parseHtml,
}

export default parseHtmlConf