import Blockly from 'blockly'
import { customBlocksJson, allGenerators } from './blocks'
import toolbox from './toolboxes'
import { clear, load, save } from './serialization'
import initialWorkspace from './workspaces/workspace.json'

import './index.css'


// import block library json
Blockly.defineBlocksWithJsonArray(customBlocksJson)

// inject blockly with our toolbox
const blocklyDiv = document.getElementById('blocklyDiv')
const workspace = Blockly.inject(blocklyDiv, {toolbox})

// inject workspace blocks
Blockly.serialization.workspaces.load(initialWorkspace, workspace)

// prepare generators and their dom targets
const jsonOutputDiv = document.getElementById('json-output')
const regenerate = () => {
  try {
    const json = allGenerators.json.workspaceToCode(workspace)
    let valid = true
    try { JSON.parse(json) }
    catch(e) {
      valid = false
      console.error('Failed to JSON.parse:', json)
      console.error(e)
    }
    const validation = `JSON is ${valid ? 'valid ✅' : 'invalid ❌'}`
    jsonOutputDiv.innerText = `${validation}\n\n${json}`
  } catch(e) {
    jsonOutputDiv.innerText = `JSON Generation Failed for:\n${json}\n\n Failed with ${e}`
  }
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

  // generate next cycle so orphans get disabled first
  setTimeout(regenerate)
})

// provide a way to clear the workspace and persistent memory
const clearButton = document.getElementById('button-clear')
clearButton.addEventListener('click', () => {
  clear(workspace)
  Blockly.serialization.workspaces.load(initialWorkspace, workspace)
})

Blockly.Extensions.register('populate_feeds_dropdown', () => {})

// load last sketch from storage
load(workspace)
// run the generators
regenerate()
