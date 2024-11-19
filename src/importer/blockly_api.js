import blocks from './blocks.json'
import toolbox from './toolbox.json'
import initialWorkspace from './workspace.json'


Blockly.defineBlocksWithJsonArray(blocks)

let currentWorkspace

export const
  inject = function(blocklyDivId, options = {}) {
    if(currentWorkspace) {
      throw new Error('Already have a workspace, dispose of it before injecting a new one.')
    }

    // inject extension data
    options.extensionData && extensions.injectData(options.extensionData)
    extensions.ready()

    if(options.disableToolboxZoom) {
      Blockly.VerticalFlyout.prototype.getFlyoutScale = () => 1
    }

    const blocklyInjectOptions = buildInjectOptions(options)

    currentWorkspace = Blockly.inject(blocklyDivId, blocklyInjectOptions)

    registerToolboxCallbacks(currentWorkspace)

    if(options.disableOrphans) {
      currentWorkspace.addChangeListener(Blockly.Events.disableOrphans)
    }

    if(options.workspaceData) {
      const workspaceJson = jsonToWorkspace(options.workspaceData)
      Blockly.serialization.workspaces.load(workspaceJson, currentWorkspace)
    } else {
      Blockly.serialization.workspaces.load(initialWorkspace, currentWorkspace)
    }

    if(options.onJsonUpdated || options.onJsonError) {
      // auto-regenerate code
      currentWorkspace.addChangeListener(e => {
        if(e.isUiEvent || // no UI events
           e.type == Blockly.Events.FINISHED_LOADING || // no on-load
           currentWorkspace.isDragging()) // not while dragging
        { return }

        // generate next cycle so orphans get disabled first
        setTimeout(() => {
          try {
            const json = workspaceToJson(currentWorkspace)
            options.onJsonUpdated?.(json)
          } catch(error) {
            options.onJsonError?.(error)
          }
        })
      })
    }

    return currentWorkspace
  },

  dispose = () => {
    extensions.dispose()
    if(!currentWorkspace) { throw new Error("Tried to dispose a non-existent workspace.") }

    currentWorkspace.dispose()
    currentWorkspace = null
  },

  // takes a workspace, returns a json string
  workspaceToJson = workspace => {
    return generators.json.workspaceToCode(workspace) || ""
  },

  // takes a json string or object, returns a workspace
  jsonToWorkspace = json => {
    const parsedJson = typeof json === 'string'
      ? JSON.parse(json)
      : json

    return regenerators.json.codeToWorkspace(parsedJson)
  }

const buildInjectOptions = options => {
  const injectOptions = {
    toolbox,
    ...options.injectOptions
  }

  return injectOptions
}
