/**
 * @description parse elem html
 * @author wangfupeng
 */

import { DOMElement } from '../utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { UiExpressionElement, Expression, UiPlayElement } from './custom-types'

function uiexpressionParseHtml(
  elem: DOMElement,
  children: SlateDescendant[],
  editor: IDomEditor
): SlateElement {
  const role = ''
  const listStr = elem.getAttribute('data-list') || ''
  const list: Expression[] = JSON.parse(decodeURIComponent(listStr)) as Expression[]
  return {
    type: 'uiexpression',
    role,
    list,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as UiExpressionElement
}

function uiplayParseHtml(
  elem: DOMElement,
  children: SlateDescendant[],
  editor: IDomEditor
): SlateElement {
  const line = elem.getAttribute('data-line') || ''
  return {
    type: 'uiplay',
    line: line,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as UiPlayElement
}


const uiexpressionParseHtmlConf = {
  // selector: 'span[data-w-e-type="uiexpression"]',
  selector: 'select[data-w-e-type="uiexpression"]',
  parseElemHtml: uiexpressionParseHtml,
}

const uiplayParseHtmlConf = {
  selector: 'span[data-w-e-type="uiplay"]',
  parseElemHtml: uiplayParseHtml,
}

export {
  uiexpressionParseHtmlConf,
  uiplayParseHtmlConf,
}