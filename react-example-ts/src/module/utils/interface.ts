import { IDomEditor } from '@wangeditor/editor'

export interface IExtendConfig {
  customEditotConfig: {
    putUiEditorText: () => void
    addExpression: (editor: IDomEditor, text:string) => void
    selectUiExpression: (line:number, role:string, sxpression:string) => void
    playUiLine: (sceneName: string, line: string) => void
    // Text
    playTextLine: (sceneName: string, line: string) => void
    addTextPlay: (editor: IDomEditor, line?: number) => void
    taggleTextCommandPanel: (line: number) => void
    tagglePanelMask: (show: boolean) => void
    editorType:"text"|"ui"
  }
}