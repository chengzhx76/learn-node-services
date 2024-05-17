/**
 * @description elem to html
 * @author wangfupeng
 */

import { SlateElement } from '@wangeditor/editor'
import { ExpressionElement } from './custom-types'

// 生成 html 的函数
function expressionToHtml(elem: SlateElement, childrenHtml: string): string {
  const { role = '', list = [] } = elem as ExpressionElement
  return `<a data-w-e-type="expression" data-w-e-is-void data-w-e-is-inline">${role}</a>`
}

// 配置
const elemToHtmlConf = {
  type: 'expression', // 节点 type ，重要！！！
  elemToHtml: expressionToHtml,
}

export default elemToHtmlConf