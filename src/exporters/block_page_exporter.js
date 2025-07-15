import { mkdirSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { capitalize, find, forEach, isString, map } from 'lodash-es'

import toBlockMarkdown from "#src/docs/render_block.js"


export default class BlockPageExporter {
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
        filenameFunc: null,
        ...givenOptions
      }

    forEach(this.definitionSet.blocks, blockDefinition => {
      const
        docPath = options.filenameFunc?.(blockDefinition)
          || blockDefinition.definitionPath.replace(/.js$/, '.md'),
        fullPath = `${this.destination}/${docPath}`

      mkdirSync(dirname(fullPath), { recursive: true })
      writeFileSync(fullPath, toBlockMarkdown(blockDefinition))
    })
  }

  exportToFile = (filenameFunc, toFile=true) => {
    this.export({ toFile, filenameFunc })
  }
}
