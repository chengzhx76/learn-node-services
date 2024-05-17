import { IDomEditor } from '@wangeditor/editor'

function withExpression<T extends IDomEditor>(editor: T): T {   // TS 语法

    return editor
}

export default withExpression