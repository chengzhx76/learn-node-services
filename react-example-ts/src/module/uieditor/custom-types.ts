
type EmptyText = {
  text: ''
}

export type Expression = {
  label: string,
  value: string,
}

export type UiEditorElement = {
  type: 'uieditor'
  role: string
  list: Expression[]
  children: EmptyText[]
}