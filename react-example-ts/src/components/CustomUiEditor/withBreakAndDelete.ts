import { IDomEditor } from '@wangeditor/editor'

function withBreakAndDelete<T extends IDomEditor>(editor: T): T {   // TS 语法
    const { insertBreak, deleteBackward } = editor // 获取当前 editor API
    const newEditor = editor

    // 重写 insertBreak 换行
    newEditor.insertBreak = () => {

        console.log('=======');

        // if: 是 ctrl + enter ，则执行 insertBreak
        insertBreak()

        // else: 则不执行换行
        return
    }

    // 重写 deleteBackward 向后删除
    newEditor.deleteBackward = unit => {
        // if： 某种情况下，执行默认的删除
        deleteBackward(unit)

        // else: 其他情况，则不执行删除
        return
    }

    // 重写其他 API ...

    // 返回 newEditor ，重要！
    return newEditor
}

export default withBreakAndDelete