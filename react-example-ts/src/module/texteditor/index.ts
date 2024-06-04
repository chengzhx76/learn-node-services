/**
 * @description uieditor module entry
 * @author wangfupeng
 */
import { IModuleConf } from '@wangeditor/editor'
import withUiEditor from './plugin'
import { renderTextCommandElemConf, renderTextLabelElemConf } from './render-elem'
import { textcommandElemToHtmlConf, textlabelElemToHtmlConf } from './elem-to-html'
import { textcommandParseHtmlConf, textlabelParseHtmlConf } from './parse-elem-html'

export * from './custom-types'
export * from './interface'

const module: Partial<IModuleConf> = {
  editorPlugin: withUiEditor,
  renderElems: [renderTextCommandElemConf, renderTextLabelElemConf],
  elemsToHtml: [textcommandElemToHtmlConf, textlabelElemToHtmlConf],
  parseElemsHtml: [textcommandParseHtmlConf, textlabelParseHtmlConf],
}

export default module