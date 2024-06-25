import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms, SlateNode, SlateRange } from '@wangeditor/editor'
import { IExtendConfig } from '../utils/interface'
import { TextCommandPanelElement, TextPlayElement } from './custom-types'
import { commandTexts } from './command'
import { showCommandPanel, hideCommandPanel } from './dom'

const commandRegx = new RegExp(commandTexts.join("|"), "gi");
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

// function showCommandPanel(editor: IDomEditor, line: number) {

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


// }

function addCommand(editor: IDomEditor, line: number, command: string) {
  hideCommandPanel(line)
  insertCommandText(editor, command, line);
}


const getLineText = (editor: IDomEditor, line: number) => {
  const path = [line];
  const node = SlateNode.get(editor, path);
  return SlateNode.string(node);
};

function insertCommandText(editor: IDomEditor, text: string, line: number) {
  if (editor) {
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
  <div class="panel hide">
    <div class="commands">
      <button class="command">插入旁白</button>
      <button class="command">插入立绘图片</button>
      <button class="command">插入背景图片</button>
      <button class="command">插入对话</button>
      <button class="command">结束游戏</button>
    </div>
    <div class="mask"></div>
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
        click: () => showCommandPanel(path[0])
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
    'div.commands',
    {
      props: {
        contentEditable: false,
      }
    },
    vcommandNodes
  )

  const vmaskNode = h(
    'div.mask',
    {
      props: {
        contentEditable: false,
      },
      on: {
        click: () => hideCommandPanel(path[0])
      }
    }
  )

  const vpanelNode = h(
    'div.panel.hide',
    {
      props: {
        contentEditable: false,
      }
    },
    [vcommandsNode, vmaskNode]
  )

  const vcommandPanelNode = h(
    'span.command-panel',
    {
      props: {
        contentEditable: false,
      }
    },
    [vshowBtnNode, vpanelNode]
  )

  return vcommandPanelNode
}

function renderTextPlay(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const extend = getTextEditorConfig(editor)
  function onPay(event:any) {
    if (extend && extend.playTextLine) { 
      extend.playTextLine(event.sceneName, event.line);
    }
  }

  const { line, sceneName } = elem as TextPlayElement

  const vselectNode = h(
    'strong.text-play',
    {
      props: {
        contentEditable: false,
      },
      attrs: {
        'data-line': line,
        'data-scene': sceneName
      },
      on: {
        click: () => onPay({ sceneName, line })
      },
      style: {
        marginLeft: '3px',
        marginRight: '3px',
        backgroundColor: 'var(--w-e-textarea-slight-bg-color)',
        borderRadius: '3px',
        padding: '0 3px',
      },
    },
    'Play'
  )

  return vselectNode
}


const renderTextCommandPanelElemConf = {
  type: 'textcommand',
  renderElem: renderTextCommandPanel,
}


const renderTextPlayElemConf = {
  type: 'textplay',
  renderElem: renderTextPlay,
}

export {
  renderTextCommandPanelElemConf,
  renderTextPlayElemConf,
}