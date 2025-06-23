import { allBlockDefinitionsAndPaths, importBlockJson } from '#src/importer/block_importer.js'


class BlockDefinition {
  definitionPath = null

  definitionJS = null

  /** @returns BlockDefinition[] */
  static async loadAll() {
    const allDefinitions = allBlockDefinitionsAndPaths.map(({ definition, path }) => {
      const blockDef = new BlockDefinition()
      blockDef.definitionJS = definition
      blockDef.definitionPath = path

      return blockDef
    })

    return allDefinitions
  }

  static async exportAll(blockDefinitions) {
    return JSON.stringify(await importBlockJson(), null, 2) + "\n"
  }

  toBlocklyJSONString = async function() {
    // return JSON.stringify(await exportBlockJSON(), null, 2) + "\n"
  }
}

export default BlockDefinition
