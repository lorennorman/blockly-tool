import { writeFileSync } from 'fs'
import { isString, keyBy, map, sortBy } from 'lodash-es'


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
      blocklyObjects = map(sortBy(this.definitionSet.blocks, "type"), ({ type }) => this.exportBlock(type)),
      blocklyCollection = keyBy(blocklyObjects, "type")

    if(!options.toFile) {
      return blocklyCollection
    }

    const filename = isString(options.toFile)
      ? options.toFile
      : `blocks.json`

    writeFileSync(`${this.destination}/${filename}`, JSON.stringify(blocklyCollection, null, 2))
  }

  exportBlock(blockType, givenOptions = {}) {
    const
      options = {
        toFile: false,
        ...givenOptions
      },
      blockDefinition = this.definitionSet.findBlock({ type: blockType }),
      blocklyObject = blockDefinition.toBlocklyJSON()

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
