import { filter } from 'lodash-es'

import exportToolboxJSON from '#src/importer/toolbox_importer.js'


class ToolboxDefinition {
  definitionPath = null

  definitionJS = null

  toBlocklyJSONString = async function() {
    return JSON.stringify(await exportToolboxJSON(), null, 2) + "\n"
  }

  getCategories = () => {
    return filter(this.definitionJS, item => item.contents || item.callback)
  }
}

export default ToolboxDefinition


ToolboxDefinition.parseRawDefinition = function(definition, path, definitionSet) {
  const toolboxDefinition = new ToolboxDefinition()
  toolboxDefinition.definitionPath = path
  toolboxDefinition.definitionJS = definition

  return toolboxDefinition
}
