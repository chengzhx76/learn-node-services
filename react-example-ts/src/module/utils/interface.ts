import { IDomEditor } from '@wangeditor/editor'

export interface IExtendConfig {
  customEditotConfig: {
    putUiEditorText: () => void
    putTextEditorText: () => void
    addExpression: (editor: IDomEditor) => void
    selectUiExpression: (line:number, role:string, sxpression:string) => void
    playUiLine: (sceneName:string, line:string) => void
  }
}