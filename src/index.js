import Blockly from 'blockly'

import "./extensions"
import { customBlocksJson } from './blocks'
import allGenerators from './blocks/generators'
import toolbox from './toolboxes'
import { clear, load, save } from './serialization'
import initialWorkspace from './workspaces/workspace.json'

import './index.css'


// import block library json
Blockly.defineBlocksWithJsonArray(customBlocksJson)

// inject blockly with our toolbox
const blocklyDiv = document.getElementById('blocklyDiv')
const workspace = Blockly.inject(blocklyDiv, {
  toolbox,
  zoom: {
    controls: true,
    wheel: true
  }
})

// hard-code toolbox scale so it ignores zoom
Blockly.VerticalFlyout.prototype.getFlyoutScale = () => 1

// inject workspace blocks
Blockly.serialization.workspaces.load(initialWorkspace, workspace)

// prepare generators and their dom targets
const jsonOutputDiv = document.getElementById('json-output')
const regenerate = () => {
  const json = allGenerators.json.workspaceToCode(workspace)

  JSON.parse(json)

  jsonOutputDiv.innerText = `JSON is valid ✅\n\n${json}`
}
const safeRegenerate = () => {
  try{
    regenerate()
  } catch(error) {
    console.error(error)
    jsonOutputDiv.innerText = `JSON generation failed ❌.`
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
  setTimeout(safeRegenerate)
})

// provide a way to clear the workspace and persistent memory
const
  clearButton = document.getElementById('button-clear'),
  clearAndInitialize = () => {
    clear(workspace)
    Blockly.serialization.workspaces.load(initialWorkspace, workspace)
  }
clearButton.addEventListener('click', clearAndInitialize)

try {
  // load last sketch from storage
  load(workspace)
  // run the generators
  regenerate()
} catch(e) {
  console.error(e)
  console.log("Refresh and regenerate from browser cache failed with the above error, clearing cache and reinitializing...")
  clearAndInitialize()
  regenerate()
  console.log("Done.")
}
