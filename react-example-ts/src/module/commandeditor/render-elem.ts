import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms, SlateNode, SlateRange } from '@wangeditor/editor'
import { Location } from 'slate'
import { TextCommandPanelElement, TextLabelElement } from './custom-types'

const commands = ['旁白:', '立绘图片:', '背景图片:', '背景音乐:', '对话:', '切换转场:', '结束游戏']
const commandRegx = new RegExp(commands.join("|"), "gi");
let isShowPanel = false;

const replaceLineText = (editor: IDomEditor, lineIndex:number, newText:string) => {
  const path = [lineIndex, 2];
  SlateTransforms.removeNodes(editor, { at: path });
  SlateTransforms.insertText(editor, newText, { at: path });
};

function showCommandPanel(editor: IDomEditor, line: number) { 

  // SlateTransforms.setNodes(editor, { id: 'custom-class' }, { at: [line] });
  const p = { type: "paragraph", children: [{ text: "程。。。" }] };
  SlateTransforms.insertNodes(editor, p, {
    at: [line],
    mode: "highest",
  });

  /* const commandPanelDoms = document.querySelectorAll(".commands");
  for (let i = 0; i < commandPanelDoms.length; i++) {
    const commandPanelDom = commandPanelDoms[i];
    if (commandPanelDom.className.indexOf("show") > -1) {
      commandPanelDom.className = "commands hide";
    }
  }
  const commandPanelDom = commandPanelDoms[line];
  if (commandPanelDom) {
    if (isShowPanel) {
      hideCommandPanel(line)
    } else {
      isShowPanel = true
      commandPanelDom.className = "commands show";
    }
  } */
}

function addCommand(editor: IDomEditor, line:number, command:string) {
  hideCommandPanel(line)
  insertCommandText(editor, command, line);
}

function hideCommandPanel(line: number) { 
  const commandPanelDoms = document.querySelectorAll(".commands");
  const commandPanelDom = commandPanelDoms[line];
  if (commandPanelDom) {
    isShowPanel = false
    commandPanelDom.className = "commands hide";
  }
}

const getLineText = (editor: IDomEditor, line: number) => {
  const path = [line];
  const node = SlateNode.get(editor, path);
  return SlateNode.string(node);
};

function insertCommandText(editor: IDomEditor, text: string, line: number) {
  if (editor && editor.selection) {
    const currentText = getLineText(editor, line)
    if (currentText && commandRegx.test(currentText)) {
      const newText = currentText.replace(commandRegx, "");
      replaceLineText(editor, line, newText)
    }
    setTimeout(() => {
      // const range = { anchor: { path, offset }, focus: { path, offset } };
      // Transforms.select(editor, range);
      const point = { path: [line, 2], offset: 0 };
      SlateTransforms.select(editor, point);
      editor.insertText(text);
    }, 0);
  }
}

/*
<span class="command-panel">
  <span class="show-panel">+</span>
  <div class="commands hide">
    <button class="command">插入旁白</button>
    <button class="command">插入立绘图片</button>
    <button class="command">插入背景图片</button>
    <button class="command">插入对话</button>
    <button class="command">结束游戏</button>
  </div>
</span>
*/

function renderTextCommandPanel(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {

  const path = DomEditor.findPath(editor, elem); 

  const { list = [] } = elem as TextCommandPanelElement
  const vbtnNodes: VNodeChildren = []
  for (let i = 0; i < list.length; i++) {
    const vbtnNode = h(
      'button.command',
      {
        on: {
          click: () => addCommand(editor, path[0], list[i].command)
        }
      },
      list[i].label
    )
    vbtnNodes.push(vbtnNode)
  }
  
  const vcommandNode = h(
    'div.commands.hide',
    {
      props: {
        contentEditable: false,
      }
    },
    vbtnNodes
  )

  const vshowIconNode = h(
    'span.show-icon',
    {
      props: {
        contentEditable: false,
      },
      on: {
        click: () => showCommandPanel(editor, path[0])
      }
    },
    '+'
  )

  const vshowPanelNode = h(
    'div.show-panel',
    {
      props: {
        contentEditable: false,
      }
    },
    [vshowIconNode]
  )

  const vcommandPanelNode = h(
    'span.command-panel',
    {
      props: {
        contentEditable: false,
      }
    },
    [vshowPanelNode, vcommandNode]
  )

  return vcommandPanelNode
}

const renderTextCommandPanelElemConf = {
  type: 'textcommand',
  renderElem: renderTextCommandPanel,
}

function renderTextLabel(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode { 
  // 构建 vnode
  const { value = '' } = elem as TextLabelElement
  const vlabelNode = h(
    'span.label',
    {
      props: {
        contentEditable: false,
      },
      style: {
        // marginLeft: '3px',
        marginRight: '3px',
        backgroundColor: 'var(--w-e-textarea-slight-bg-color)',
        // borderRadius: '3px',
        padding: '0 3px',
      }
    },
    value
  )
  return vlabelNode
}

const renderTextLabelElemConf = {
  type: 'textlabel',
  renderElem: renderTextLabel,
}

export {
  renderTextCommandPanelElemConf,
  renderTextLabelElemConf,
}