import { writeFileSync } from 'fs'
import { isString } from 'lodash-es'


export default class WorkspaceExporter {
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
      workspaceObject = this.definitionSet.primaryWorkspace().toBlocklyJSON()

    if(!options.toFile) {
      return workspaceObject
    }

    const filename = isString(options.toFile)
      ? options.toFile
      : `workspace.json`

    writeFileSync(`${this.destination}/${filename}`, JSON.stringify(workspaceObject, null, 2))
  }

  exportToFile = (toFile=true) => {
    this.export({ toFile })
  }

  static export() {

  }
}
