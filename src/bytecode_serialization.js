import Blockly from 'blockly/core'

import allGenerators from './blocks/generators'
import allRegenerators from './blocks/regenerators'


const storageKey = 'blocklyToolWorkspaceBytecode'

const workspaceToBytecode = workspace => {
  return allGenerators.json.workspaceToCode(workspace)
}

const bytecodeToWorkspace = bytecode => {
  return allRegenerators.json.codeToWorkspace(bytecode)
}

/**
 * Clears the workspace and wipes the browser's local storage.
 * @param {Blockly.Workspace} workspace Blockly workspace to save.
 */
export const clear = function(workspace) {
  window.localStorage?.removeItem(storageKey)
  workspace.clear()
}

/**
 * Saves the state of the workspace to browser's local storage.
 * @param {Blockly.Workspace} workspace Blockly workspace to save.
 */
export const save = function(workspace) {
  const workspaceBytecode = workspaceToBytecode(workspace)
  window.localStorage?.setItem(storageKey, workspaceBytecode)
}

/**
 * Loads saved state from local storage into the given workspace.
 * @param {Blockly.Workspace} workspace Blockly workspace to load into.
 */
export const load = function(workspace) {
  const bytecodeString = window.localStorage?.getItem(storageKey)
  const bytecode = JSON.parse(bytecodeString)
  if (!bytecode) return

  // Don't emit events during loading.
  Blockly.Events.disable()
  try {
    const workspaceData = bytecodeToWorkspace(bytecode)
    Blockly.serialization.workspaces.load(workspaceData, workspace, false)
  } catch(e) {
    console.error("Failed to load a stored Blockly state, Blockly system may have changed incompatibly.")
    console.error(e)
    return
  } finally {
    Blockly.Events.enable()
  }
  return true
}
