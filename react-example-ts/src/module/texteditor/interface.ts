/**
 * @description interface
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/editor'

export interface IExtendConfig {
  textEditotConfig: {
    addTextCommand: (editor: IDomEditor) => void
  }
}