import Blockly from 'blockly'
import { filter } from 'lodash-es'

import initialWorkspace from '../export/workspace.json'
import { inject, jsonToWorkspace, workspaceToJson } from '../export/blockly.js'
import { clear, load, save } from './serialization'

import './index.css'


// wire up the internal json to the dom
const
  topBlocksDiv = document.getElementById('top-blocks'),
  totalBlocksDiv = document.getElementById('total-blocks'),
  totalWorkspacesDiv = document.getElementById('total-workspaces'),
  blocklyJsonOutputDiv = document.getElementById('blockly-json'),
  bytecodeJsonOutputDiv = document.getElementById('bytecode-json'),

  onJsonUpdated = bytecodeJson => {
    topBlocksDiv.innerText = workspace.getTopBlocks().length
    totalBlocksDiv.innerText = workspace.getAllBlocks().length

    blocklyJsonOutputDiv.innerText = ``
    bytecodeJsonOutputDiv.innerText = `Bytecode is valid JSON ✅\n\n${bytecodeJson}`

    try {
      const workspaceJson = JSON.stringify(jsonToWorkspace(bytecodeJson), null, 2)
      blocklyJsonOutputDiv.innerText = `Workspace JSON\n\n${workspaceJson}`
    } catch(error) {
      console.error("Workspace JSON Error:\n", error)
      console.error("JSON:\n", bytecodeJson)
      blocklyJsonOutputDiv.innerText = `Workspace JSON generation failed ❌\nYou may need the "Clear" button above.`
    }
  },

  onJsonError = error => {
    console.error("Bytecode JSON Error:\n", error)
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
    ],
    weatherLocations: [
      { powerUpId: 1, lat: 40.65513, lon: -74.01111 },
      { powerUpId: 2, lat: 42.93994, lon: -85.62748 },
      { powerUpId: 3, lat: 36.14993, lon: -86.75903 },
    ]
  },
  injectOptions: {
    zoom: { controls: true, wheel: true }
  }
})

// register listeners

setInterval(() => {
  const
    workspaces = Blockly.Workspace.getAll(),
    total = workspaces.length,
    mutators = filter(workspaces, 'isMutator').length,
    flyouts = filter(workspaces, 'isFlyout').length,
    rest = total - mutators - flyouts

  totalWorkspacesDiv.innerText = `${rest}:${flyouts}:${mutators}`

}, 1000)
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

  let workspaceJson
  try{
    // convert bytecode to workspace json
    workspaceJson = jsonToWorkspace(bytecodeJson)

  } catch(e) {
    console.error("Failed to parse bytecode:", bytecodeJson)
  }

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
