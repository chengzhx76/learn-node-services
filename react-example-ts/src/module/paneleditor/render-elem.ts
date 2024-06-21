import { h, VNode, VNodeChildren } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement, SlateTransforms, SlateNode, SlateRange } from '@wangeditor/editor'
import { Location } from 'slate'
import { IExtendConfig } from '../utils/interface'
import { TextCommandPanelElement } from './custom-types'
import { commands } from './command'

const commandRegx = new RegExp(['旁白:', '立绘图片:', '背景图片:', '背景音乐:', '对话:', '切换转场:', '结束游戏'].join("|"), "gi");
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


const commandPanelNode: TextCommandPanelElement = {
  type: "textcommand",
  list: commands,
  children: [{ text: "" }],
};

function getCommandPanelLocation(editor: IDomEditor, line: number, nodeType:string): Location | undefined{
  const descendantNodes = SlateNode.descendants(editor, {
    from: [line],
    to: [line],
    reverse: true,
    pass: ([node]) => DomEditor.getNodeType(node) === nodeType,
  });
  for (const [node, path] of descendantNodes) {
    const type = DomEditor.getNodeType(node);
    if (type === nodeType) {
      return path;
    }
  }
  return undefined
}

function showCommandPanel(editor: IDomEditor, line: number) {

  console.log("showCommandPanel", line);

 /*  if (editor) {
      editor.restoreSelection();
      SlateTransforms.insertNodes(editor, commandShowPanelNode, {
        at: [1, 0],
      });
  } */
  
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


  // SlateTransforms.setNodes(editor, { id: 'custom-class' }, { at: [line] });
  /* const p = { type: "paragraph", children: [{ text: "程。。。" }] };
  SlateTransforms.insertNodes(editor, p, {
    at: [line],
    mode: "highest",
  }); */

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
  hideCommandPanel(editor, line)
  insertCommandText(editor, command, line);
}

function hideCommandPanel(editor: IDomEditor, line: number) { 
  const commandPanelDoms = document.querySelectorAll(".commands");
  const commandPanelDom = commandPanelDoms[line];
  if (commandPanelDom) {
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
	<div class="show-btn">
		<span class="icon-img">+</span>
	</div>
	<div class="commands hide">
		<button class="command">${label}</button>
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
        // click: () => showCommandPanel(editor, path[0])
      }
    },
    '+'
  )

  const vshowPanelNode = h(
    'div.show-btn',
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



export {
  renderTextCommandPanelElemConf,
}