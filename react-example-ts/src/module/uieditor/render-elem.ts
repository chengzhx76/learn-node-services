/**
 * @description render elem
 * @author wangfupeng
 */

import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms } from '@wangeditor/editor'
import { UiExpressionElement, UiPlayElement } from './custom-types'

function renderUiExpression(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {

  const path = DomEditor.findPath(editor, elem); 
  // console.log('renderUiExpression==> ', path);

  
  function updateSelect(event:any) {
    /* console.log('Selected value:', event.target.value);
    const p = { type: 'paragraph', children: [{ text: event.target.value }] };
      const insertPath = [path[0]];
      SlateTransforms.insertNodes(editor, p, {
        at: insertPath // 在 link-card 后面插入
      }); */
  }
  // 构建 vnode
  const { role = '', selected = '', list = [] } = elem as UiExpressionElement

  const options: VNodeChildren = []
  for (let i = 0; i < list.length; i++) {
    const option = h(
      'option',
      {
        /* props: {
          value: list[i].value,
        }, */
        attrs: {
          value: list[i].value,
          selected: list[i].value === selected
        }
      },
      list[i].label
    )
    options.push(option)
  }
  const vselectNode = h(
    'select',
    {
      props: {
        contentEditable: false, // 不可编辑
      },
      on: {
        change: updateSelect
      },
      style: {
        marginLeft: '3px',
        marginRight: '3px',
        backgroundColor: 'var(--w-e-textarea-slight-bg-color)',
        borderRadius: '3px',
        padding: '0 3px',
      },
    },
    options
  )

  return vselectNode
}

function renderUiPlay(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 构建 vnode
  const { line } = elem as UiPlayElement

  const vselectNode = h(
    'span.ui-play',
    {
      props: {
        contentEditable: false, // 不可编辑
      },
      style: {
        marginLeft: '3px',
        marginRight: '3px',
        backgroundColor: 'var(--w-e-textarea-slight-bg-color)',
        borderRadius: '3px',
        padding: '0 3px',
      },
    },
    'Play'
  )

  return vselectNode
}

const renderUiExpressionElemConf = {
  type: 'uiexpression', // 节点 type ，重要！！！
  renderElem: renderUiExpression,
}

const renderUiPlayElemConf = {
  type: 'uiplay', // 节点 type ，重要！！！
  renderElem: renderUiPlay,
}

export {
  renderUiExpressionElemConf,
  renderUiPlayElemConf,
}