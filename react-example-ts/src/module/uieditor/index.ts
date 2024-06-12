/**
 * @description uieditor module entry
 * @author wangfupeng
 */
import { IModuleConf } from '@wangeditor/editor'
import withUiEditor from './plugin'
import { renderUiExpressionElemConf, renderUiPlayElemConf } from './render-elem'
import { uiexpressionElemToHtmlConf, uiplayElemToHtmlConf } from './elem-to-html'
import { uiexpressionParseHtmlConf, uiplayParseHtmlConf } from './parse-elem-html'

export * from './custom-types'

const module: Partial<IModuleConf> = {
  editorPlugin: withUiEditor,
  renderElems: [renderUiExpressionElemConf, renderUiPlayElemConf],
  elemsToHtml: [uiexpressionElemToHtmlConf, uiplayElemToHtmlConf],
  parseElemsHtml: [uiexpressionParseHtmlConf, uiplayParseHtmlConf],
}

export default module