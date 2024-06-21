import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms, SlateNode, SlateRange } from '@wangeditor/editor'
import { IExtendConfig } from '../utils/interface'
import { TextCommandPanelElement } from './custom-types'

const commandRegx = new RegExp(['旁白:', '黑屏文字:', '立绘图片:', '背景图片:', '背景音乐:', '对话:', '切换转场:', '结束游戏'].join("|"), "gi");
let isShowPanel = false;
function getTextEditorConfig(editor: IDomEditor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { customEditotConfig } = EXTEND_CONF as IExtendConfig
  return customEditotConfig
}

const replaceLineText = (editor: IDomEditor, lineIndex:number, newText:string) => {
  const path = [lineIndex, 2];
  SlateTransforms.removeNodes(editor, { at: path });
  SlateTransforms.insertText(editor, newText, { at: path });
};

function showCommandPanel(editor: IDomEditor, line: number) {

  console.log("showCommandPanel", line);

  // const extend = getTextEditorConfig(editor)
  // if (extend.taggleTextCommandPanel) extend.taggleTextCommandPanel(line)

  /* let showLocal: Location | undefined = getCommandPanelLocation(editor, line, "textcommandshow");
  if (showLocal) {
    SlateTransforms.removeNodes(editor, { at: showLocal });
    editor.insertNode(commandHidePanelNode);
    return;
  } */

  /* let hideLocal: Location | undefined = getCommandPanelLocation(editor, line, "textcommandhide");
  if (hideLocal) {
    SlateTransforms.removeNodes(editor, { at: hideLocal });
  } */
  // editor.insertNode(commandShowPanelNode);


  const commandPanelDoms = document.querySelectorAll(".commands");
  for (let i = 0; i < commandPanelDoms.length; i++) {
    const commandPanelDom = commandPanelDoms[i];
    if (commandPanelDom.className.indexOf("show") > -1) {
      commandPanelDom.className = "commands hide";
    }
  }

  const commandPanelDom = commandPanelDoms[line];
  if (commandPanelDom) {
    if (isShowPanel) {
      hideCommandPanel(editor, line)
    } else {
      isShowPanel = true
      commandPanelDom.className = "commands show";
    }
  }
}

function addCommand(editor: IDomEditor, line:number, command:string) {
  hideCommandPanel(editor, line)
  insertCommandText(editor, command, line);
}

function hideCommandPanel(editor: IDomEditor, line: number) { 
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
  
  const viconImgNode = h(
    'span.icon-img.hide',
    {
      props: {
        contentEditable: false,
      },
      on: {
        click: () => showCommandPanel(editor, path[0])
      },
    },
    '+'
  )
  
  const vshowBtnNode = h(
    'div.show-btn',
    {
      props: {
        contentEditable: false,
      }
    },
    [viconImgNode]
  )

  // btn
  
  const { list = [] } = elem as TextCommandPanelElement
  const vcommandNodes: VNodeChildren = []
  for (let i = 0; i < list.length; i++) {
    const {icon, label, command} = list[i]
    const viconNode = h(
      'img.icon',
      {
        props: {
          contentEditable: false,
          src: icon,
          alt: label
        }
      }
    )
    const vlabelNode = h(
      'span.label',
      {
        props: {
          contentEditable: false,
        }
      },
      label
    )

    const vcommandNode = h(
      'button.command',
      {
        props: {
          contentEditable: false,
        },
        on: {
          click: () => addCommand(editor, path[0], command)
        }
      },
      [viconNode, vlabelNode]
    )
    vcommandNodes.push(vcommandNode)
  }

  const vcommandsNode = h(
    'div.commands.hide',
    {
      props: {
        contentEditable: false,
      }
    },
    vcommandNodes
  )

  const vcommandPanelNode = h(
    'span.command-panel',
    {
      props: {
        contentEditable: false,
      }
    },
    [vshowBtnNode, vcommandsNode]
  )

  return vcommandPanelNode
}

const renderTextCommandPanelElemConf = {
  type: 'textcommand',
  renderElem: renderTextCommandPanel,
}

export {
  renderTextCommandPanelElemConf,
}