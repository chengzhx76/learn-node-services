
type EmptyText = {
  text: ''
}

export type Expression = {
  label: string,
  value: string,
}

export type UiExpressionElement = {
  type: 'uiexpression'
  role: string
  selected: string
  list: Expression[]
  children: EmptyText[]
}

export type UiPlayElement = {
  type: 'uiplay'
  line: string
  sceneName: string
  children: EmptyText[]
}