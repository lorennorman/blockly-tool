import { capitalize, filter } from 'lodash-es'

import { allBlockDefinitionsAndPaths, importBlockJson } from '#src/importer/block_importer.js'


class BlockDefinition {
  definitionSet = null

  definitionPath = null

  definitionJS = null

  name = null

  type = null

  visualization = null

  connections = null

  lines = null

  disabled = false

  categories = []

  /** @returns BlockDefinition[] */
  static async loadAll(definitionSet) {
    const allDefinitions = allBlockDefinitionsAndPaths.map(({ definition, path }) => {
      const blockDef = new BlockDefinition()
      blockDef.definitionSet = definitionSet
      blockDef.definitionJS = definition
      blockDef.definitionPath = path
      blockDef.type = definition.type
      blockDef.disabled = !!definition.disabled
      blockDef.visualization = definition.visualization
      blockDef.connections = definition.connections
      blockDef.lines = definition.lines
      blockDef.name = definition.name ||
        capitalize(definition.type.replaceAll("_", " ").replace(/^io /, ""))

      return blockDef
    })

    return allDefinitions
  }

  static async exportAll(blockDefinitions) {
    return JSON.stringify(await importBlockJson(), null, 2) + "\n"
  }

  getCategories() {
    return (this.definitionSet
      ? filter(this.definitionSet.getCategories(), ({ contents=[], usesBlocks=[]}) =>
          contents.includes(this.type) || usesBlocks.includes(this.type)
        )
      : [])
  }

  toBlocklyJSONString = async function() {
    // return JSON.stringify(await exportBlockJSON(), null, 2) + "\n"
  }
}

export default BlockDefinition
