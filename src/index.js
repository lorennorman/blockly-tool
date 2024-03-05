import Blockly from 'blockly'
import ModernTheme from '@blockly/theme-modern'

import extensions from "./extensions"
import { customBlocksJson } from './blocks'
import allGenerators from './blocks/generators'
import toolbox from './toolboxes'
import { clear, load, save } from './serialization'
import initialWorkspace from './workspaces/workspace.json'

import './index.css'


extensions.injectData({feedOptions: [
  ["Feeder 1", "1"],
  ["Feed Z", "Z"],
  ["Feedinsky &", "&"],
]})
extensions.ready()

// import block library json
Blockly.defineBlocksWithJsonArray(customBlocksJson)

// inject blockly with our toolbox
const blocklyDiv = document.getElementById('blocklyDiv')
const workspace = Blockly.inject(blocklyDiv, {
  toolbox,
  zoom: {
    controls: true,
    wheel: true
  },
  theme: ModernTheme
})

// hard-code toolbox scale so it ignores zoom
Blockly.VerticalFlyout.prototype.getFlyoutScale = () => 1

// inject workspace blocks
Blockly.serialization.workspaces.load(initialWorkspace, workspace)

// prepare generators and their dom targets
const jsonOutputDiv = document.getElementById('json-output')
const regenerate = () => {
  const json = allGenerators.json.workspaceToCode(workspace)

  try {
    let valid = true
    try { JSON.parse(json) }
    catch(e) {
      valid = false
      console.error('Failed to JSON.parse:', json)
      console.error(e)
    }
    const validation = `JSON is ${valid ? 'valid ✅' : 'invalid ❌'}`
    jsonOutputDiv.innerText = `${validation}\n\n${json}`
    console.log(validation)
    console.log(json)
  } catch(e) {
    jsonOutputDiv.innerText = `JSON Generation Failed for:\n${json}\n\n Failed with ${e}`
    console.error(e)
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
const
  clearButton = document.getElementById('button-clear'),
  clearAndInitialize = () => {
    clear(workspace)
    Blockly.serialization.workspaces.load(initialWorkspace, workspace)
  }
clearButton.addEventListener('click', clearAndInitialize)

const jsonButton = document.getElementById('button-json')
const jsonOutputContainer = document.getElementById('json-output-container')
jsonButton.addEventListener('click', () => {
  jsonOutputContainer.style.visibility = (jsonOutputContainer.style.visibility !== "visible")
    ? "visible"
    : "hidden"
})

// load last sketch from storage
if(!load(workspace)) {
  clearAndInitialize()
}
// run the generators
regenerate()
