/**
 * @description elem to html
 * @author wangfupeng
 * 
 * 把新元素转换为 HTML
 * 当你把 myResume 插入到编辑器，并渲染成功，此时执行 editor.getHtml() 获取的 HTML 里并没有“@用户”元素。接下来需要定义如何输入 HTML 。
 */

import { SlateElement } from '@wangeditor/editor'
import { MentionElement } from './custom-types'

/**
 * 生成“@用户”元素的 HTML
 * @param elem 附件元素，即上文的 myResume
 * @param childrenHtml 子节点的 HTML 代码，void 元素可忽略
 * @returns “@用户”元素的 HTML 字符串
 */
function mentionToHtml(elem: SlateElement, childrenHtml: string): string {
  const { value = '', info = {} } = elem as MentionElement
  const infoStr = encodeURIComponent(JSON.stringify(info))
  /*
  使用 data-w-e-type 记录元素 type ，以便解析 HTML 时（下文讲）能识别到（parse-elem-html.ts）
  使用 data-w-e-is-void 标记元素是 void ，以便解析 HTML 时能识别
  使用 data-w-e-is-inline 标记元素是 inline ，以便解析 HTML 时能识别
  */
  return `<span
            data-w-e-type="mention"
            data-w-e-is-void
            data-w-e-is-inline
            data-value="${value}" 
            data-info="${infoStr}"
            >@${value}</span>`
}

// 配置
const conf = {
  type: 'mention', // 节点 type ，重要！！！
  elemToHtml: mentionToHtml,
}

export default conf