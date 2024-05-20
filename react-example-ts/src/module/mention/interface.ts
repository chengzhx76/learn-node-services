/**
 * @description interface
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/editor'

export interface IExtendConfig {
  mentionConfig: {
    showModal: (editor: IDomEditor) => void
    hideModal: (editor: IDomEditor) => void
  }
}