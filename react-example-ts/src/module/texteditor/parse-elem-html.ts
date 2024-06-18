/**
 * @description parse elem html
 * @author wangfupeng
 */

import { DOMElement } from '../utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { TextCommandPanelElement, Command, TextLabelElement } from './custom-types'

function textcommandParseHtml(elem: DOMElement, children: SlateDescendant[], editor: IDomEditor): SlateElement {
  const listStr = elem.getAttribute('data-list') || ''
  const list: Command[] = JSON.parse(decodeURIComponent(listStr)) as Command[]
  return {
    type: 'textcommand',
    list,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as TextCommandPanelElement
}

const textcommandParseHtmlConf = {
  selector: 'span[data-w-e-type="textcommand"]',
  parseElemHtml: textcommandParseHtml,
}

function textlabelParseHtml(elem: DOMElement, children: SlateDescendant[], editor: IDomEditor): SlateElement {
  const value = elem.getAttribute('data-label') || ''
  return {
    type: 'textlabel',
    value,
    children: [{ text: '' }], // void node 必须有一个空白 text
  } as TextLabelElement
}

const textlabelParseHtmlConf = {
  selector: 'span[data-w-e-type="textlabel"]',
  parseElemHtml: textcommandParseHtml,
}

export {
  textcommandParseHtmlConf,
  textlabelParseHtmlConf,
}