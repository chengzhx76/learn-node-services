import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms, SlateNode } from '@wangeditor/editor'
import { Location } from 'slate'
import { TextCommandElement, TextLabelElement } from './custom-types'

function showCommandPanel(line: number) { 
  console.log("showCommandPanel", line);
  const commandPanelDoms = document.querySelectorAll(".commands");
  for (let i = 0; i < commandPanelDoms.length; i++) {
    const commandPanelDom = commandPanelDoms[i];
    if (commandPanelDom.className.indexOf("show") > -1) {
      commandPanelDom.className = "commands hide";
    }
  }
  const commandPanelDom = commandPanelDoms[line];
  if (commandPanelDom) { 
    commandPanelDom.className = "commands show";
  }
}

function addCommand(editor: IDomEditor, line:number, command:string) {
  hideCommandPanel(line)
  renderCommandText(editor, command, line);
}

function hideCommandPanel(line: number) { 
  const commandPanelDoms = document.querySelectorAll(".commands");
  const commandPanelDom = commandPanelDoms[line];
  if (commandPanelDom) {
    commandPanelDom.className = "commands hide";
  }
}

function renderCommandText(editor: IDomEditor, text: string, i: number) {
  if (editor && editor.selection) {

    const { selection } = editor;
    const linePath = selection.anchor.path;

    const descendantNodes = SlateNode.descendants(editor, {
      from: [linePath[0]],
      to: [linePath[0]],
      reverse: true,
      pass: ([node]) => DomEditor.getNodeType(node) === "textlabel",
    });

    let removePath: Location = [];
    for (const [node, path] of descendantNodes) {
      console.log(node, path);

      const type = DomEditor.getNodeType(node);
      if (type === "textlabel") {
        removePath = path;
        break;
      }
    }
    if (removePath.length > 0) {
      SlateTransforms.removeNodes(editor, { at: removePath });
    }

    const labelNode:TextLabelElement = {
      type: "textlabel",
      value: text,
      children: [{ text: "" }],
    };
    editor.insertNode(labelNode);
  }
}

function renderTextCommandPanel(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {

  const path = DomEditor.findPath(editor, elem); 
  console.log('renderTextCommand==> ', path);
  
  // 构建 vnode
  const { list = [] } = elem as TextCommandElement

  const lis: VNodeChildren = []
  for (let i = 0; i < list.length; i++) {
    const li = h(
      'li',
      {
        on: {
          click: () => addCommand(editor, path[0], list[i].command)
        }
      },
      list[i].label
    )
    lis.push(li)
  }
  
  const vulNode = h(
    'ul.commands.hide',
    {
      props: {
        contentEditable: false,
      }
    },
    lis
  )

  const vspanNode = h(
    'span.show-panel',
    {
      props: {
        contentEditable: false,
      },
      on: {
        click: () => showCommandPanel(path[0])
      }
    },
    '+'
  )

  const vcommandNode = h(
    'span.command-panel',
    {
      props: {
        contentEditable: false,
      }
    },
    [vspanNode, vulNode]
  )

  return vcommandNode
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
        marginLeft: '3px',
        marginRight: '3px',
        backgroundColor: 'var(--w-e-textarea-slight-bg-color)',
        borderRadius: '3px',
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