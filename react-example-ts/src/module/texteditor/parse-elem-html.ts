/**
 * @description parse elem html
 * @author wangfupeng
 */

import { DOMElement } from '../utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { TextCommandPanelElement, Command, TextLabelElement } from './custom-types'

function textcommandPanelParseHtml(elem: DOMElement, children: SlateDescendant[], editor: IDomEditor): SlateElement {
  const listStr = elem.getAttribute('data-list') || ''
  const list: Command[] = JSON.parse(decodeURIComponent(listStr)) as Command[]
  return {
    type: 'textcommand',
    list,
    children: [{ text: '' }],
  } as TextCommandPanelElement
}

const textcommandPanelParseHtmlConf = {
  selector: 'span[data-w-e-type="textcommand"]',
  parseElemHtml: textcommandPanelParseHtml,
}

function textlabelParseHtml(elem: DOMElement, children: SlateDescendant[], editor: IDomEditor): SlateElement {
  const value = elem.getAttribute('data-label') || ''
  return {
    type: 'textlabel',
    value,
    children: [{ text: '' }],
  } as TextLabelElement
}

const textlabelParseHtmlConf = {
  selector: 'span[data-w-e-type="textlabel"]',
  parseElemHtml: textlabelParseHtml,
}

export {
  textcommandPanelParseHtmlConf,
  textlabelParseHtmlConf,
}