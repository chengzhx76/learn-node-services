
type EmptyText = {
  text: ''
}

export type Expression = {
  label: '',
  value: '',
}

export type ExpressionElement = {
  type: 'expression'
  role: string
  list: Expression[]
  children: EmptyText[]
}