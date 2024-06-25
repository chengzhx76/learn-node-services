import { DOMElement } from '../utils/dom'
import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor/editor'
import { TextCommandPanelElement, TextPlayElement, Command } from './custom-types'

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

function textplayParseHtml(
  elem: DOMElement,
  children: SlateDescendant[],
  editor: IDomEditor
): SlateElement {
  const line = elem.getAttribute('data-line') || ''
  return {
    type: 'textplay',
    line: line,
    children: [{ text: '' }],
  } as TextPlayElement
}


const textplayParseHtmlConf = {
  selector: 'span[data-w-e-type="textplay"]',
  parseElemHtml: textplayParseHtml,
}

export {
  textcommandPanelParseHtmlConf,
  textplayParseHtmlConf,
}