/**
 * @description uieditor module entry
 * @author wangfupeng
 */
import { IModuleConf } from '@wangeditor/editor'
import withUiEditor from './plugin'
import { renderTextCommandPanelElemConf } from './render-elem'
import { textcommandPanelElemToHtmlConf } from './elem-to-html'
import { textcommandPanelParseHtmlConf } from './parse-elem-html'

export * from './custom-types'
export * from './command'

const module: Partial<IModuleConf> = {
  editorPlugin: withUiEditor,
  renderElems: [renderTextCommandPanelElemConf],
  elemsToHtml: [textcommandPanelElemToHtmlConf],
  parseElemsHtml: [textcommandPanelParseHtmlConf],
}

export default module