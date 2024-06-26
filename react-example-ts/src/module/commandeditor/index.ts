/**
 * @description uieditor module entry
 * @author wangfupeng
 */
import { IModuleConf } from '@wangeditor/editor'
import withUiEditor from './plugin'
import { renderTextCommandPanelElemConf, renderTextPlayElemConf } from './render-elem'
import { textcommandPanelElemToHtmlConf, textplayElemToHtmlConf } from './elem-to-html'
import { textcommandPanelParseHtmlConf, textplayParseHtmlConf } from './parse-elem-html'

export * from './custom-types'
export * from './command'
export * from './dom'

const module: Partial<IModuleConf> = {
  editorPlugin: withUiEditor,
  renderElems: [renderTextCommandPanelElemConf, renderTextPlayElemConf],
  elemsToHtml: [textcommandPanelElemToHtmlConf, textplayElemToHtmlConf],
  parseElemsHtml: [textcommandPanelParseHtmlConf, textplayParseHtmlConf],
}

export default module