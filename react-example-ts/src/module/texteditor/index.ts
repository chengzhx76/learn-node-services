/**
 * @description uieditor module entry
 * @author wangfupeng
 */
import { IModuleConf } from '@wangeditor/editor'
import withUiEditor from './plugin'
import { renderTextCommandElemConf } from './render-elem'
import { textcommandElemToHtmlConf } from './elem-to-html'
import { textcommandParseHtmlConf } from './parse-elem-html'

export * from './custom-types'
export * from './interface'

const module: Partial<IModuleConf> = {
  editorPlugin: withUiEditor,
  renderElems: [renderTextCommandElemConf],
  elemsToHtml: [textcommandElemToHtmlConf],
  parseElemsHtml: [textcommandParseHtmlConf],
}

export default module