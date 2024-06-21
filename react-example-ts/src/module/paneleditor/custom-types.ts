
type EmptyText = {
  text: ''
}

export type Command = {
  label: string
  command: string
}

export type TextCommandPanelElement = {
  type: 'textcommand'
  list: Command[]
  children: EmptyText[]
}