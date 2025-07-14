import { writeFileSync } from 'fs'
import { find, isString } from 'lodash-es'


export default class ToolboxExporter {
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
      toolboxObject = this.definitionSet.primaryToolbox().toBlocklyJSON()

    if(!options.toFile) {
      return toolboxObject
    }

    const filename = isString(options.toFile)
      ? options.toFile
      : `toolbox.json`

    writeFileSync(`${this.destination}/${filename}`, JSON.stringify(toolboxObject, null, 2))
  }

  exportCategory(categoryName) {
    const
      toolboxObject = this.export(),
      category = find(toolboxObject.contents, { name: categoryName })

    return category
  }

  exportToFile = (toFile=true) => {
    this.export({ toFile })
  }
}
