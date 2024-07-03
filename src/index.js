import Blockly from 'blockly'
import ModernTheme from '@blockly/theme-modern'

import extensions from "./extensions"
import "./mutators"
import { customBlocksJson } from './blocks'
import allGenerators from './blocks/generators'
import allRegenerators from './blocks/regenerators'
import toolbox from './toolboxes'
import { clear, load, save } from './serialization'
import initialWorkspace from './workspaces/workspace.json'

import './index.css'


extensions.injectData({feedOptions: [
  ["Feeder 1", "abc123"],
  ["A Feed Z", "qrstuv"],
  ["Feedinsky &", "oneforyou-oneforme"],
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
const blocklyJsonOutputDiv = document.getElementById('blockly-json')
const bytecodeJsonOutputDiv = document.getElementById('bytecode-json')
const regenerate = () => {
  const json = allGenerators.json.workspaceToCode(workspace)

  if(!json) {
    bytecodeJsonOutputDiv.innerText = "workspaceToCode(workspace) created nothing"
    blocklyJsonOutputDiv.innerText = "workspaceToCode(workspace) created nothing"
    return
  }

  try {
    let valid = true
    try { JSON.parse(json) }
    catch(e) {
      valid = false
      console.error('Failed to JSON.parse:', json)
      console.error(e)
    }
    const validation = `Bytecode JSON is ${valid ? 'valid ✅' : 'invalid ❌'}`
    bytecodeJsonOutputDiv.innerText = `${validation}\n\n${json}`
    // if(valid) { return }
    // console.log(validation)
    // console.log(json)
  } catch(e) {
    blocklyJsonOutputDiv.innerText = `JSON Generation Failed for:\n${json}\n\n Failed with ${e}`
    console.error(e)
    return
  }

  const bytecode = allRegenerators.json.codeToWorkspace(JSON.parse(json))
  blocklyJsonOutputDiv.innerText = JSON.stringify(bytecode, null, 2)
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

const reloadBytecodeButton = document.getElementById('button-reload-bytecode')
reloadBytecodeButton.addEventListener('click', () => {
  // export bytecode
  const bytecodeJson = allGenerators.json.workspaceToCode(workspace)
  // convert bytecode to workspace json
  const workspaceJson = allRegenerators.json.codeToWorkspace(JSON.parse(bytecodeJson))

  // disable events while we're working
  Blockly.Events.disable()
  try {
    // clear workspace
    workspace.clear()
    // load workspace json
    Blockly.serialization.workspaces.load(workspaceJson, workspace)

    console.log("Reloaded diagram from bytecode.")

  } catch(e) {
    console.log('Failed diagram reload. Reloading stored workspace...')
    console.error(e)

    load(workspace)

  } finally {
    Blockly.Events.enable()
  }
})

const reloadSerializedButton = document.getElementById('button-reload-serialized')
reloadSerializedButton.addEventListener('click', () => {
  load(workspace)
})

// load last sketch from storage
if(!load(workspace)) {
  clearAndInitialize()
}
// run the generators
regenerate()
