import Blockly from 'blockly'

import initialWorkspace from './workspace.json'
import { inject, jsonToWorkspace, workspaceToJson } from './blockly.js'
import { clear, load, save } from './serialization'

import './index.css'


// wire up the internal json to the dom
const
  blocklyJsonOutputDiv = document.getElementById('blockly-json'),
  bytecodeJsonOutputDiv = document.getElementById('bytecode-json'),

  onJsonUpdated = bytecodeJson => {
    blocklyJsonOutputDiv.innerText = ``
    bytecodeJsonOutputDiv.innerText = `Bytecode is valid JSON ✅\n\n${bytecodeJson}`

    try {
      const workspaceJson = JSON.stringify(jsonToWorkspace(bytecodeJson), null, 2)
      blocklyJsonOutputDiv.innerText = `Workspace JSON\n\n${workspaceJson}`
    } catch(error) {
      blocklyJsonOutputDiv.innerText = `Workspace JSON generation failed ❌\nYou may need the "Clear" button above.`
    }
  },

  onJsonError = error => {
    bytecodeJsonOutputDiv.innerText = `Bytecode generation failed ❌\nYou may need the "Clear" button above.`
    blocklyJsonOutputDiv.innerText = `Workspace JSON not generated.`
  }

const workspace = inject('blocklyDiv', {
  disableOrphans: true,
  disableToolboxZoom: true,
  onJsonUpdated,
  onJsonError,
  extensionData: {
    feedOptions: [
      ["Feeder 1", "abc123"],
      ["A Feed Z", "qrstuv"],
      ["Feedinsky &", "oneforyou-oneforme"],
    ]
  },
  injectOptions: {
    zoom: { controls: true, wheel: true }
  }
})

// register listeners

// auto-save on non-UI changes
workspace.addChangeListener((e) => e.isUiEvent || save(workspace))

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
  const bytecodeJson = workspaceToJson(workspace)
  // convert bytecode to workspace json
  const workspaceJson = jsonToWorkspace(bytecodeJson)

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

// INITIALIZE ON LOAD
load(workspace)
