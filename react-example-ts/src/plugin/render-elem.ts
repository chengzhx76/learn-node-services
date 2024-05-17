/**
 * @description render elem
 * @author wangfupeng
 */

import { h, VNode } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor'
import { ExpressionElement } from './custom-types'

function renderExpression(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // const isDisabled = editor.isDisabled()

  // 当前节点是否选中
  // const selected = DomEditor.isNodeSelected(editor, elem)

  // 构建 vnode
  const { role = '', list = [] } = elem as ExpressionElement
  const selectNode = h(
    'div#divId',
    {},
    [role]
  )

  return selectNode
}

const renderElemConf = {
  type: 'expression', // 节点 type ，重要！！！
  renderElem: renderExpression,
}

export default renderElemConf