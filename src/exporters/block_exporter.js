import { writeFileSync } from 'fs'
import { isString, map, sortBy } from 'lodash-es'

import { toBlockJSON } from '#src/exporters/block_processor/index.js'


export default class BlockExporter {
  definitionSet = null
  destination = null

  constructor(definitionSet, destination) {
    this.definitionSet = definitionSet
    this.destination = destination
  }

  export(givenOptions = {}) {
    const
      options = {
        toFile: false,
        ...givenOptions
      },
      blocklyObjects = map(sortBy(this.definitionSet.blocks, "type"), this.exportBlock)

    if(!options.toFile) {
      return blocklyObjects
    }

    const filename = isString(options.toFile)
      ? options.toFile
      : `blocks.json`

    writeFileSync(`${this.destination}/${filename}`, JSON.stringify(blocklyObjects, null, 2))
  }

  exportBlockByType(blockType, givenOptions = {}) {
    if(!this.definitionSet) {
      throw new Error(`Cannot exportBlockByType without a DefinitionSet. Exporting: "${blockType}"`)
    }

    const blockDefinition = this.definitionSet.findBlock({ type: blockType })

    return this.exportBlock(blockDefinition, givenOptions)
  }

  exportBlock(blockDefinition, givenOptions = {}) {
    const
      options = {
        toFile: false,
        ...givenOptions
      },
      blocklyObject = toBlockJSON(blockDefinition)

    if(!options.toFile) { return blocklyObject }

    const filename = isString(options.toFile)
      ? options.toFile
      : `${blockDefinition.type}.json`

    writeFileSync(`${this.destination}/${filename}`, JSON.stringify(blocklyObject))
  }

  exportBlockTrunk(blockType) {
    const blockDefinition = this.definitionSet.findBlock({ type: blockType })

    return blockDefinition.toBlocklyInstanceJSON()
  }

  exportToFile = (toFile=true) => {
    this.export({ toFile })
  }
}

BlockExporter.export = (blockDefinition, givenOptions = {}) => {
  return new BlockExporter().exportBlock(blockDefinition, givenOptions)
}
