import { capitalize, filter, invokeMap } from 'lodash-es'

import { toBlockJSON } from '#src/importer/block_processor/index.js'
import { allBlockDefinitionsAndPaths, importBlockJson } from '#src/importer/block_importer.js'


class BlockDefinition {
  definitionSet = null

  definitionPath = null

  definitionJS = null

  name = null

  type = null

  colour = null
  color = null

  visualization = null

  inputsInline = false

  connections = null

  lines = null

  disabled = false

  categories = []

  /** @returns BlockDefinition */
  static parseDefinition(rawBlockDefinition, definitionPath) {
    if(!rawBlockDefinition.type) {
      throw new Error('BlockDefinition: A unique `type` property is required for block definitions.')
    }

    const blockDef = new BlockDefinition()
    blockDef.definitionPath = definitionPath
    blockDef.type = rawBlockDefinition.type
    // blockDef.definitionSet = definitionSet
    // blockDef.definitionJS = rawBlockDefinition
    // blockDef.disabled = !!rawBlockDefinition.disabled
    blockDef.visualization = rawBlockDefinition.visualization
    blockDef.connections = rawBlockDefinition.connections
    blockDef.lines = rawBlockDefinition.lines
    blockDef.colour = rawBlockDefinition.color || rawBlockDefinition.colour || rawBlockDefinition.visualization?.color || rawBlockDefinition.visualization?.colour || "0"
    blockDef.color = blockDef.colour
    blockDef.inputsInline = rawBlockDefinition.inputsInline || false
    blockDef.name = rawBlockDefinition.name
    if(!blockDef.name) {
      // if no name given, humanize the type property as a default
      console.warn(`No "name" property provided for block: "${rawBlockDefinition.type}" (${definitionPath})`)
      blockDef.name = rawBlockDefinition.type.split(/[\W_]+/).map(capitalize).join(" ").replace(/^io /i, "")
    }

    return blockDef
  }

  /** @returns BlockDefinition[] */
  static async loadAll(definitionSet) {
    const allDefinitions = allBlockDefinitionsAndPaths.map(({ definition, path }) =>
      BlockDefinition.parseDefinition(definition, path)
    )

    return allDefinitions
  }

  static allToBlocklyJSONString(blockDefinitions) {
    return JSON.stringify(this.allToBlocklyJSON(blockDefinitions), null, 2) + "\n"
  }

  static allToBlocklyJSON(blockDefinitions) {
    return invokeMap(blockDefinitions, 'toBlocklyJSON')
  }

  getCategories() {
    return (this.definitionSet
      ? filter(this.definitionSet.getCategories(), ({ contents=[], usesBlocks=[]}) =>
          contents.includes(this.type) || usesBlocks.includes(this.type)
        )
      : [])
  }

  toBlocklyJSON() {
    return toBlockJSON(this)
  }

  toBlocklyJSONString() {
    return JSON.stringify(this.toBlocklyJSON(), null, 2) + "\n"
  }
}

export default BlockDefinition
