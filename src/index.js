import * as Blockly from 'blockly'
import { allBlocksJson, allGenerators } from './blocks'
import toolbox from './toolbox'
import { save, load } from './serialization'
import workspaceBlocks from './workspace.xml?raw'

import './index.css'


// export block library json
Blockly.defineBlocksWithJsonArray(allBlocksJson)

// inject blockly with our toolbox
const blocklyDiv = document.getElementById('blocklyDiv')
const workspace = Blockly.inject(blocklyDiv, {toolbox})

// inject workspace blocks
Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(workspaceBlocks, 'text/xml'), workspace)

// prepare generators and their dom targets
const jsonOutputDiv = document.getElementById('json-output')
const markdownOutputDiv = document.getElementById('markdown-output')
const regenerate = () => {
  try {

    const json = allGenerators.json.workspaceToCode(workspace)
    let valid = true
    try { JSON.parse(json) }
    catch(e) {
      valid = false
      console.error(e)
    }
    const validation = `JSON is ${valid ? 'valid ✅' : 'invalid ❌'}`
    jsonOutputDiv.innerText = `${validation}\n\n${json}`
  } catch(e) {
    jsonOutputDiv.innerText = `JSON Generation Failed:\n${e}`
  }

  const markdown = allGenerators.markdown.workspaceToCode(workspace)
  markdownOutputDiv.innerText = markdown
}

// register listeners

// enforce one top-level block
workspace.addChangeListener(Blockly.Events.disableOrphans)

// auto-save on non-UI changes
workspace.addChangeListener((e) => e.isUiEvent || save(workspace))

// auto-regenerate code
workspace.addChangeListener((e) => {
  if(e.isUiEvent || // no UI events
     e.type == Blockly.Events.FINISHED_LOADING || // no on-load
     workspace.isDragging()) // not while dragging
  { return }

  regenerate()
})

// load last sketch from storage
load(workspace)
// run the generators
regenerate()
