
type EmptyText = {
  text: ''
}

export type Command = {
  label: string
  command: string
}

export type TextCommandElement = {
  type: 'textcommand'
  list: Command[]
  children: EmptyText[]
}