/**
 * @description parse elem html
 * @author wangfupeng
 */

import { DOMElement } from './utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { ExpressionElement, Expression } from './custom-types'

function parseHtml(
  elem: DOMElement,
  children: SlateDescendant[],
  editor: IDomEditor
): SlateElement {
  const role = elem.getAttribute('data-role') || ''
  const expressionStr = elem.getAttribute('data-role') || ''
  const list: Expression[] = JSON.parse(decodeURIComponent(expressionStr)) as Expression[]
  return {
    type: 'expression',
    role,
    list,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as ExpressionElement
}

const parseHtmlConf = {
  selector: 'div[data-w-e-type="expression"]',
  parseElemHtml: parseHtml,
}

export default parseHtmlConf