import Blockly from 'blockly'
import { allBlocksJson, allGenerators } from './blocks'
import toolbox from './toolbox'
import { clear, load, save } from './serialization'
import workspaceBlocks from './workspace.json'

import './index.css'


// import block library json
Blockly.defineBlocksWithJsonArray(allBlocksJson)

// inject blockly with our toolbox
const blocklyDiv = document.getElementById('blocklyDiv')
const workspace = Blockly.inject(blocklyDiv, {toolbox})

// inject workspace blocks
Blockly.serialization.workspaces.load(workspaceBlocks, workspace)

// prepare generators and their dom targets
const jsonOutputDiv = document.getElementById('json-output')
// const markdownOutputDiv = document.getElementById('markdown-output')
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
  Blockly.serialization.workspaces.load(workspaceBlocks, workspace)
})

Blockly.Extensions.register('populate_feeds_dropdown', () => {})

// load last sketch from storage
load(workspace)
// run the generators
regenerate()
