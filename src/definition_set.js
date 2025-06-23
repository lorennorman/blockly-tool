import WorkspaceDefinition from "#src/workspace_definition.js"
import ToolboxDefinition from "#src/toolbox_definition.js"
import BlockDefinition from "#src/block_definition.js"


export class DefinitionSet {
  /** @type WorkspaceDefinition[] */
  workspaces = []

  /** @type ToolboxDefinition[] */
  toolboxes = []

  /** @type BlockDefinition[] */
  blocks = []

  static async load() {
    const newDefinitionSet = new DefinitionSet()

    newDefinitionSet.workspaces = WorkspaceDefinition.loadAll()
    newDefinitionSet.toolboxes = await ToolboxDefinition.loadAll()
    newDefinitionSet.blocks = await BlockDefinition.loadAll()

    return newDefinitionSet
  }

  getBlocksFrom(...referrers) {
    return {
      toBlocklyJSON: async () => await BlockDefinition.exportAll(this.blocks)
    }
  }
}

export default DefinitionSet
