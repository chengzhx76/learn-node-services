/**
 * @description uieditor module entry
 * @author wangfupeng
 */
import { IModuleConf } from '@wangeditor/editor'
import withUiEditor from './plugin'

const module: Partial<IModuleConf> = {
  editorPlugin: withUiEditor,
}

export default module