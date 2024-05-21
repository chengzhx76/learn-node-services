/**
 * @description parse elem html
 * @author wangfupeng
 */

import { DOMElement } from '../utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { UiEditorElement, Expression } from './custom-types'

function parseHtml(
  elem: DOMElement,
  children: SlateDescendant[],
  editor: IDomEditor
): SlateElement {
  const role = ''
  const listStr = elem.getAttribute('data-list') || ''
  const list: Expression[] = JSON.parse(decodeURIComponent(listStr)) as Expression[]
  return {
    type: 'uieditor',
    role,
    list,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as UiEditorElement
}

const parseHtmlConf = {
  selector: 'span[data-w-e-type="uieditor"]',
  parseElemHtml: parseHtml,
}

export default parseHtmlConf