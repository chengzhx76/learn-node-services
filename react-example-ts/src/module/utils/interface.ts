import { IDomEditor } from '@wangeditor/editor'

export interface IExtendConfig {
  customEditotConfig: {
    putUiEditorText: () => void
    addExpression: (editor: IDomEditor, text:string) => void
    selectUiExpression: (line:number, role:string, sxpression:string) => void
    playUiLine: (sceneName:string, line:string) => void
  }
}