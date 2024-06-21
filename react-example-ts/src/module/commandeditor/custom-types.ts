
type EmptyText = {
  text: ''
}

export type Command = {
  icon: string
  label: string
  command: string
}

export type TextCommandPanelElement = {
  type: 'textcommand'
  list: Command[]
  children: EmptyText[]
}