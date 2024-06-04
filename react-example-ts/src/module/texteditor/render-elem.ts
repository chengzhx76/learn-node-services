/**
 * @description render elem
 * @author wangfupeng
 */

import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms, SlateEditor } from '@wangeditor/editor'
import { TextCommandElement, TextLabelElement } from './custom-types'

/* function showCommandPanel() {
  const commandPanelDoms = document.querySelectorAll(".commands");
  console.log('commandPanelDoms==>', commandPanelDoms)
  if (commandPanelDoms && commandPanelDoms.length > 0) {
    for (let i = 0; i < commandPanelDoms.length; i++) {
      const commandPanelDom = commandPanelDoms[i];
      console.log('commandPanelDom.className', commandPanelDom.className);
      if (commandPanelDom.className.indexOf("show") > -1) {
        commandPanelDom.className = "commands hide";
      } else {
        commandPanelDom.className = "commands show";
      }
    }
  }
}
 */

function renderText(editor: IDomEditor, text: string, i: number) {
  /* const p = { type: "paragraph", children: [{ text: text }] };
  SlateTransforms.insertNodes(editor, p, {
    at: [i],
    // mode: "highest",
  }); */
  if (editor) {

    const { selection } = editor;

    const labelNode:TextLabelElement = {
      type: "textlabel",
      value: text,
      children: [{ text: "" }],
    };
    // editor.restoreSelection();
    editor.insertNode(labelNode);
    // SlateTransforms.insertNodes(editor, labelNode, {at: [i, 2]});
  }
}



function renderTextCommand(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {

  const path = DomEditor.findPath(editor, elem); 
  console.log('renderTextCommand==> ', path);
  
  function showCommand(line:number, event?: MouseEvent) { 
    console.log('showCommand==> ', line);
    // showCommandPanel()
    const commandPanelDoms = document.querySelectorAll(".commands");
    for (let i = 0; i < commandPanelDoms.length; i++) {
      const commandPanelDom = commandPanelDoms[i];
      if (commandPanelDom.className.indexOf("show") > -1) {
        commandPanelDom.className = "commands hide";
      }
    }
    const commandPanelDom = commandPanelDoms[line];
    // console.log('commandPanelDom==> ', commandPanelDoms.length, commandPanelDom);
    if (commandPanelDom) { 
      commandPanelDom.className = "commands show";
    }
    return
  }
  function addCommand(line:number, command:string) {
    console.log('addCommand==> ', line, command);
    const commandPanelDoms = document.querySelectorAll(".commands");
    const commandPanelDom = commandPanelDoms[line];
    if (commandPanelDom) {
      commandPanelDom.className = "commands hide";
    }

    renderText(editor, command, line);

    return
  }
  // 构建 vnode
  const { list = [] } = elem as TextCommandElement

  const lis: VNodeChildren = []
  for (let i = 0; i < list.length; i++) {
    const li = h(
      'li',
      {
        on: {
          click: () => addCommand(path[0], list[i].command)
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
        // mouseenter: () => showCommand(path[0])
        click: () => showCommand(path[0])
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

const renderTextCommandElemConf = {
  type: 'textcommand',
  renderElem: renderTextCommand,
}

function renderTextLabel(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode { 
  // 构建 vnode
  const { value = [] } = elem as TextLabelElement
  const vlabelNode = h(
    'span.label',
    value
  )
  return vlabelNode
}

const renderTextLabelElemConf = {
  type: 'textlabel',
  renderElem: renderTextLabel,
}

export {
  renderTextCommandElemConf,
  renderTextLabelElemConf,
}