
type EmptyText = {
  text: ''
}

export type Command = {
  label: string
  command: string
}

export type TextLabelElement = {
  type: 'textlabel'
  value: string
  children: EmptyText[]
}

export type TextCommandElement = {
  type: 'textcommand'
  list: Command[]
  children: EmptyText[]
}