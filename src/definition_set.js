import { writeFileSync } from 'fs'
import { forEach } from 'lodash-es'

import DefinitionLoader from '#src/definition_loader.js'
import BlocklyJSExporter from '#src/blockly_js_exporter.js'
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

  getBlocksFrom(...referrers) {
    return {
      toBlocklyJSON: () => BlockDefinition.allToBlocklyJSONString(this.blocks)
    }
  }

  getCategories() {
    return this.toolboxes[0].getCategories()
  }

  async export(options = {}) {
    const destination = options.to || "export"
    writeFileSync(`${destination}/workspace.json`, await this.workspaces[0].toBlocklyJSONString())
    writeFileSync(`${destination}/toolbox.json`, await this.toolboxes[0].toBlocklyJSONString())
    writeFileSync(`${destination}/blocks.json`, BlockDefinition.allToBlocklyJSONString(this.blocks))
    writeFileSync(`${destination}/blockly_app.js`, await BlocklyJSExporter.exportFor({
      blocks: this.blocks,
      toolbox: this.toolboxes[0],
      workspace: this.workspaces[0],
    }))
  }
}

export default DefinitionSet

DefinitionSet.load = async function() {
  // locate all files for all definition types
  //   verify shape of each raw definition type (required and optional keys -> value types)
  // hydrate interlinked definition instances
  //   de-sugar raw definitions
  //   verify referenced definitions exist

  const
    rawDefinitions = await DefinitionLoader.loadAll(),
    definitionSet = new DefinitionSet()

  // TODO: fields
  // TODO: shadows
  // TODO: inputs
  // TODO: mixins
  // TODO: extensions
  // TODO: mutators

  forEach(rawDefinitions.blocks, ({ definition, path }) => {
    const blockDef = BlockDefinition.parseRawDefinition(definition, path, definitionSet)
    definitionSet.blocks.push(blockDef)
  })

  forEach(rawDefinitions.toolboxes, rawToolboxDef => {
    const toolboxDef = ToolboxDefinition.parseRawDefinition(rawToolboxDef, definitionSet)
    definitionSet.toolboxes.push(toolboxDef)
  })

  forEach(rawDefinitions.workspaces, rawWorkspaceDef => {
    const workspaceDef = WorkspaceDefinition.parseRawDefinition(rawWorkspaceDef, definitionSet)
    definitionSet.workspaces.push(workspaceDef)
  })

  return definitionSet
}
