/**
 * @description render elem
 * @author wangfupeng
 */

import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor'
import { UiEditorElement } from './custom-types'

function renderUiEditor(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 构建 vnode
  const { role = '', list = [] } = elem as UiEditorElement

  const options: VNodeChildren = []
  for (let i = 0; i < list.length; i++) {
    const option = h(
      'option',
      { props: { value: list[i].value } },
      list[i].label
    )
    options.push(option)
  }

  const vselectNode = h(
    'select',
    {},
    options
  )

  return vselectNode
}

const renderElemConf = {
  type: 'uieditor', // 节点 type ，重要！！！
  renderElem: renderUiEditor,
}

export default renderElemConf