import { h, VNode, VNodeChildren } from 'snabbdom'
import { Text } from 'slate'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms, SlateNode, SlateEditor } from '@wangeditor/editor'
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

function addCommand(editor: IDomEditor, line: number, command: string) {
  hideCommandPanel(line)
  const extend = getTextEditorConfig(editor)
  if (extend.tagglePanelMask) extend.tagglePanelMask(false)
  insertCommandText(editor, command, line);
}

const getLineText = (editor: IDomEditor, line: number) => {
  const path = [line];
  const node = SlateNode.get(editor, path);
  return SlateNode.string(node);
};

function insertCommandText(editor: IDomEditor, commandText: string, line: number) {
  if (editor) {
    const currentText = getLineText(editor, line)
    let insertText = currentText
    let insertPath = [line, 0]

    if (currentText) {
      if (commandRegx.test(currentText)) {
        insertText = currentText.replace(commandRegx, "");
      }
      const descendantNodes = SlateNode.descendants(editor, {
        from: [line],
        to: [line],
        reverse: true,
      });
      for (const [node, path] of descendantNodes) { 
        if (Text.isText(node) && SlateNode.string(node)) { 
          insertPath = path
          SlateTransforms.removeNodes(editor, { at: path });
          break
        }
      }
    }
    insertText = commandText + insertText
    SlateTransforms.insertText(editor, insertText, { at: insertPath });
    setTimeout(() => {
      SlateTransforms.select(editor, { path: insertPath, offset: insertText.length });
    }, 500)
    setTimeout(() => {
      const extend = getTextEditorConfig(editor)
      if (extend.addTextPlay) extend.addTextPlay(editor, line)
    }, 300)

  }
}

function showCommandPanelHandler(editor: IDomEditor, line: number) {
  showCommandPanel(line)
  const extend = getTextEditorConfig(editor)
  if (extend.tagglePanelMask) extend.tagglePanelMask(true)
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
    'strong.icon-img.hide',
    {
      props: {
        contentEditable: false,
      },
      on: {
        click: () => showCommandPanelHandler(editor, path[0])
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
      'i.label',
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

  /* const vmaskNode = h(
    'div.mask',
    {
      props: {
        contentEditable: false,
      },
      on: {
        click: () => hideCommandPanel(path[0])
      }
    }
  ) */

  const vpanelNode = h(
    'div.panel.hide',
    {
      props: {
        contentEditable: false,
      }
    },
    [vcommandsNode/* , vmaskNode */]
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