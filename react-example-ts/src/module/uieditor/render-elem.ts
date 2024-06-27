/**
 * @description render elem
 * @author wangfupeng
 */

import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor'
import { UiExpressionElement, UiPlayElement } from './custom-types'
import { IExtendConfig } from '../utils/interface'

function getUiEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}

function renderUiExpression(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {

  const path = DomEditor.findPath(editor, elem);
  const line = path[0]

  const extend = getUiEditorConfig(editor)
  function updateSelect(event:any) {
    console.log('Selected value:', event.target.value, line);
    if (extend && extend.selectUiExpression) { 
      extend.selectUiExpression(line, '', event.target.value);
    }
  }

  const { role = '', selected = '', list = [] } = elem as UiExpressionElement
  const options: VNodeChildren = []
  for (let i = 0; i < list.length; i++) {
    let attrs = {}
    if (list[i].value === selected) {
      attrs = {
        selected: true
      }
    }
    let option = h(
      'option',
      {
        props: {
          value: list[i].value,
        },
        attrs: attrs
      },
      list[i].label
    )
    options.push(option)
  }
  const vselectNode = h(
    `select#expression_${ path[0]}.ui-expression`,
    {
      props: {
        // contentEditable: false, // 不可编辑
      },
      on: {
        change: updateSelect
      }
    },
    options
  )

  return vselectNode
}

function renderUiPlay(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const extend = getUiEditorConfig(editor)
  function onPay(event:any) {
    // console.log('onPay value:', event);
    if (extend && extend.playUiLine) { 
      extend.playUiLine(event.sceneName, event.line);
    }
  }

  const { line, sceneName } = elem as UiPlayElement

  const vselectNode = h(
    'strong.ui-play',
    {
      props: {
        contentEditable: false,
      },
      attrs: {
        'data-line': line,
        'data-scene': sceneName
      },
      on: {
        click: () => onPay({ sceneName, line })
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