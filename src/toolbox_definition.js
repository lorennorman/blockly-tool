import { forEach, filter } from 'lodash-es'

import { exportToolboxJSON } from '#src/importer/toolbox_importer.js'


class ToolboxDefinition {
  definitionPath = null

  definitionJS = null

  // all contents in the toolbox
  contents = []
  // just the categories
  categories = []

  toBlocklyJSONString = async function() {
    return JSON.stringify(await exportToolboxJSON(this), null, 2) + "\n"
  }
}

export default ToolboxDefinition


ToolboxDefinition.parseRawDefinition = function(definition, definitionSet) {
  const toolboxDefinition = new ToolboxDefinition()
  toolboxDefinition.definitionJS = definition

  forEach(definition, item => {
    // all items go into contents
    toolboxDefinition.contents.push(item)

    // only categories have names, and get special processing
    if (!item.name) { return }

    // for static category contents...
    if(item.contents) {
      // replace block types with block definitions
      item.contents = item.contents.map(blockType =>
        definitionSet.findBlock({ type: blockType })
      )
    }

    toolboxDefinition.categories.push(item)
  })

  return toolboxDefinition
}
