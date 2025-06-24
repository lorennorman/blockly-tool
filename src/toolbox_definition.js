import { filter } from 'lodash-es'

import exportToolboxJSON from '#src/importer/toolbox_importer.js'
import toolboxDefinition from '#app/toolbox/index.js'


class ToolboxDefinition {
  definitionPath = null

  definitionJS = toolboxDefinition

  static async loadAll() {
    const toolboxDef = new ToolboxDefinition()
    toolboxDef.definitionPath = "toolbox/index"

    return [ toolboxDef ]
  }

  toBlocklyJSONString = async function() {
    return JSON.stringify(await exportToolboxJSON(), null, 2) + "\n"
  }

  getCategories = () => {
    return filter(toolboxDefinition, item => item.contents || item.callback)
  }
}

export default ToolboxDefinition
