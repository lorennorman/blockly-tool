import { writeFileSync } from 'fs'
import { assign, find, forEach, isArray, isObject, isString, reject } from 'lodash-es'

import DefinitionLoader from '#src/definition_loader.js'
import BlocklyJSExporter from '#src/blockly_js_exporter.js'
import WorkspaceDefinition from "#src/workspace_definition.js"
import ToolboxDefinition from "#src/toolbox_definition.js"
import BlockDefinition from "#src/block_definition.js"


export class DefinitionSet {
  exportDirectory = "export"
  /** @type WorkspaceDefinition[] */
  workspaces = []

  /** @type ToolboxDefinition[] */
  toolboxes = []

  /** @type BlockDefinition[] */
  blocks = []

  mixins = {}
  extensions = {}
  mutators = {}
  generators = {}
  regenerators = {}

  getBlocksFrom(...referrers) {
    return {
      toBlocklyJSON: () => BlockDefinition.allToBlocklyJSONString(this.blocks)
    }
  }

  findBlock(query) {
    const found = find(this.blocks, query)
    if(!found) {
      throw new Error(`No block found for query: ${ JSON.stringify(query) }`)
    }

    return found
  }

  getCategories() {
    return this.toolboxes[0].categories
  }

  exportBlock(blockType, givenOptions = {}) {
    const
      options = {
        toFile: false,
        ...givenOptions
      },
      blockDefinition = this.findBlock({ type: blockType }),
      blocklyObject = blockDefinition.toBlocklyJSON()

    if(!options.toFile) { return blocklyObject }

    const filename = isString(options.toFile)
      ? options.toFile
      : `${blockDefinition.type}.json`

    writeFileSync(`${this.exportDirectory}/${filename}`, JSON.stringify(blocklyObject))
  }

  async export(options = {}) {
    const destination = options.to || this.exportDirectory
    writeFileSync(`${destination}/workspace.json`, this.workspaces[0].toBlocklyJSONString())
    writeFileSync(`${destination}/toolbox.json`, this.toolboxes[0].toBlocklyJSONString())
    writeFileSync(`${destination}/blocks.json`, BlockDefinition.allToBlocklyJSONString(this.blocks))
    writeFileSync(`${destination}/blockly_app.js`, await BlocklyJSExporter.exportFor({
      blocks: this.blocks,
      toolbox: this.toolboxes[0],
      workspace: this.workspaces[0],
      mixins: this.mixins,
      extensions: this.extensions,
      mutators: this.mutators,
      generators: this.generators,
      regenerators: this.regenerators,
    }))
  }
}

export default DefinitionSet

DefinitionSet.load = async function(appLocation) {
  // locate all files for all definition types
  //   verify shape of each raw definition type (required and optional keys -> value types)
  // hydrate interlinked definition instances
  //   de-sugar raw definitions
  //   verify referenced definitions exist

  const
    rawDefinitions = await DefinitionLoader.loadAll({ source: appLocation }),
    enabledBlocks = reject(rawDefinitions.blocks, "definition.disabled"),
    definitionSet = new DefinitionSet()

  // TODO: fields
  // TODO: shadows
  // TODO: inputs

  definitionSet.mixins = rawDefinitions.mixins
  definitionSet.extensions = rawDefinitions.extensions
  definitionSet.mutators = rawDefinitions.mutators

  forEach(enabledBlocks, ({ definition, path }) => {
    const blockDef = BlockDefinition.parseRawDefinition(definition, path, definitionSet)
    definitionSet.blocks.push(blockDef)

    // process inline mixins:
    const { mixins } = definition
    // could be a list of mixin names and objects
    if(isArray(mixins)) {
      // step through each mixin
      forEach(mixins, mixin => {
        if(isString(mixin)){
          // TODO: validate named mixins actually exist

        } else {
          // objects get assigned up into the definition set's mixins
          // TODO: error if any keys exist
          assign(definitionSet.mixins, mixin)
        }
      })

    // could be a single mixin
    } else if(isObject(mixins)) {
      // TODO: error if any keys exist
      assign(definitionSet.mixins, mixins)
    }

    // process inline extensions:
    const { extensions } = definition
    if(isArray(extensions)) {
      // TODO: check named extensions actually exist

    } else if(isObject(extensions)) {
      // TODO: error if any keys exist
      assign(definitionSet.extensions, extensions)
    }

    // process mutator
    const { mutator } = definition
    if(isObject(mutator)) {
      definitionSet.mutators[blockDef.type] = mutator
    }

    definitionSet.generators[blockDef.type] = blockDef.generators
    definitionSet.regenerators[blockDef.type] = blockDef.regenerators
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
