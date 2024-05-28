/**
 * @description parse elem html
 * @author wangfupeng
 */

import { DOMElement } from '../utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { TextCommandElement, Command } from './custom-types'

function textcommandParseHtml(
  elem: DOMElement,
  children: SlateDescendant[],
  editor: IDomEditor
): SlateElement {
  const listStr = elem.getAttribute('data-list') || ''
  const list: Command[] = JSON.parse(decodeURIComponent(listStr)) as Command[]
  return {
    type: 'textcommand',
    list,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as TextCommandElement
}

const textcommandParseHtmlConf = {
  selector: 'div[data-w-e-type="textcommand"]',
  parseElemHtml: textcommandParseHtml,
}

export {
  textcommandParseHtmlConf,
}