
type EmptyText = {
  text: ''
}

export type Command = {
  icon: string
  label: string
  command: string
}

export type TextPlayElement = {
  type: 'textplay'
  line: string
  sceneName: string
  children: EmptyText[]
}

export type TextCommandPanelElement = {
  type: 'textcommand'
  list: Command[]
  children: EmptyText[]
}