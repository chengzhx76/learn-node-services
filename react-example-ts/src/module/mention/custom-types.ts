/**
 * @description mention element
 * @author wangfupeng
 * 定义节点数据结构
 */

type EmptyText = {
  text: ''
}
export type MentionElement = {
  type: 'mention'
  value: string
  info: any
  children: EmptyText[] // void 元素必须有一个空 text
}