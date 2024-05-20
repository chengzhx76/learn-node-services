/**
 * @description interface
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/editor'

export interface IExtendConfig {
  uiEditotConfig: {
    addPay: (editor: IDomEditor) => void
    addExpression: (editor: IDomEditor) => void
  }
}