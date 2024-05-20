/**
 * @description render elem
 * @author wangfupeng
 * 
 * 在编辑器中渲染新元素
 * 数据结构定义好了，但编辑器现在还不认识它，执行 editor.insertNode(myResume) 也不会有任何效果。
 * 接下来就需要让编辑器认识它，能根据 myResume 的数据，渲染出我们想要的 UI 界面。
 * 
 * 此时，你再执行 editor.insertNode(myResume) 就可以看到“附件”元素被渲染到了编辑器中。

 */

import { h, VNode } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor'
import { MentionElement } from './custom-types'

/**
 * 渲染“@用户”元素到编辑器
 * @param elem @用户元素，即上文的 myResume
 * @param children 元素子节点，void 元素可忽略
 * @param editor 编辑器实例
 * @returns vnode 节点（通过 snabbdom.js 的 h 函数生成）
 */
function renderMention(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 当前节点是否选中
  const selected = DomEditor.isNodeSelected(editor, elem)
  const { value = '' } = elem as MentionElement

  // 构建 vnode
  const vnode = h(
    'span',
    {
      props: {
        contentEditable: false, // 不可编辑
      },
      style: {
        marginLeft: '3px',
        marginRight: '3px',
        backgroundColor: 'var(--w-e-textarea-slight-bg-color)',
        border: selected // 选中/不选中，样式不一样
          ? '2px solid var(--w-e-textarea-selected-border-color)' // wangEditor 提供了 css var https://www.wangeditor.com/v5/theme.html
          : '2px solid transparent',
        borderRadius: '3px',
        padding: '0 3px',
      },
    },
    `@${value}` // 如 `@张三`
  )

  return vnode
}

const conf = {
  type: 'mention', // 节点 type ，重要！！！
  renderElem: renderMention,
}

export default conf