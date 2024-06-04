import { IDomEditor } from '@wangeditor/editor'

export interface IExtendConfig {
  commandEditotConfig: {
    addCommand: (editor: IDomEditor) => void
  }
}