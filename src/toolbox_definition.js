import { forEach, filter } from 'lodash-es'

import exportToolboxJSON from '#src/importer/toolbox_importer.js'


class ToolboxDefinition {
  definitionPath = null

  definitionJS = null

  categories = []
  toBlocklyJSONString = async function() {
    return JSON.stringify(await exportToolboxJSON(), null, 2) + "\n"
  }
}

export default ToolboxDefinition


ToolboxDefinition.parseRawDefinition = function(definition, definitionSet) {
  const toolboxDefinition = new ToolboxDefinition()
  toolboxDefinition.definitionJS = definition

  forEach(definition, item => {
    if(item.name) {
      toolboxDefinition.categories.push(item)
    }
  })

  return toolboxDefinition
}
