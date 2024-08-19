import blocks from './blocks.json'
import toolbox from './toolbox.json'
import initialWorkspace from './workspace.json'


Blockly.defineBlocksWithJsonArray(blocks)


export const
  inject = (blocklyDivId, options = {}) => {

    // inject extension data
    options.extensionData && extensions.injectData(options.extensionData)
    extensions.ready()

    if(options.disableToolboxZoom) {
      Blockly.VerticalFlyout.prototype.getFlyoutScale = () => 1
    }

    const
      blocklyInjectOptions = buildInjectOptions(options),
      workspace = Blockly.inject(blocklyDivId, blocklyInjectOptions)

    registerToolboxCallbacks(workspace)

    if(options.disableOrphans) {
      workspace.addChangeListener(Blockly.Events.disableOrphans)
    }

    Blockly.serialization.workspaces.load(initialWorkspace, workspace)

    if(options.onJsonUpdated || options.onJsonError) {
      // auto-regenerate code
      workspace.addChangeListener(e => {
        if(e.isUiEvent || // no UI events
           e.type == Blockly.Events.FINISHED_LOADING || // no on-load
           workspace.isDragging()) // not while dragging
        { return }

        // generate next cycle so orphans get disabled first
        setTimeout(() => {
          try {
            const json = workspaceToJson(workspace)
            options.onJsonUpdated?.(json)
          } catch(error) {
            options.onJsonError?.(error)
          }
        })
      })
    }

    return workspace
  },

  // takes a workspace, returns a json string
  workspaceToJson = workspace => {
    return generators.json.workspaceToCode(workspace) || ""
  },

  // takes a json string, returns a workspace
  jsonToWorkspace = json => {
    return regenerators.json.codeToWorkspace(JSON.parse(json))
  }

const buildInjectOptions = options => {
  const injectOptions = {
    toolbox,
    ...options.injectOptions
  }


  return injectOptions
}
