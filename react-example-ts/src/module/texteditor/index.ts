/**
 * @description uieditor module entry
 * @author wangfupeng
 */
import { IModuleConf } from '@wangeditor/editor'
import withUiEditor from './plugin'
import { renderTextCommandPanelElemConf, renderTextLabelElemConf } from './render-elem'
import { textcommandElemToHtmlConf, textlabelElemToHtmlConf } from './elem-to-html'
import { textcommandParseHtmlConf, textlabelParseHtmlConf } from './parse-elem-html'

export * from './custom-types'
export * from './command'

const module: Partial<IModuleConf> = {
  editorPlugin: withUiEditor,
  renderElems: [renderTextCommandPanelElemConf, renderTextLabelElemConf],
  elemsToHtml: [textcommandElemToHtmlConf, textlabelElemToHtmlConf],
  parseElemsHtml: [textcommandParseHtmlConf, textlabelParseHtmlConf],
}

export default module