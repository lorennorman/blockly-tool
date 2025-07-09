import { readFileSync } from 'node:fs'
import { keyBy, mapValues, filter } from 'lodash-es'
// import importBlocklyJs from '#src/importer/blockly_importer.js'

import renderTemplate from '#src/importer/template_renderer.js'
import renderObject from '#src/importer/object_renderer.js'


const section = (title, contents) => `
///////////
// ${title}
///////////
${contents}
`

export const BlocklyJSExporter = {
  exportFor: async (options = {}) => {
    const { blocks, toolbox, workspace } = options

    // return importBlocklyJs()

    return [
      "import Blockly from 'blockly'\n\n",
      section("Toolbox", exportToolboxJs(toolbox)),
      // section("Mixins", await importMixinsJs()),
      // section("Extensions", await importExtensionsJs()),
      // section("Mutators", await importMutatorsJs()),
      // section("Generators", await importGeneratorsJs()),
      // section("Regenerators", await importRegeneratorsJs()),
      section("Blockly API Wrapper", readFileSync(`./src/importer/blockly_api.js`))
    ].join("")
  }
}

const exportToolboxJs = toolboxDefinition => {
  const
    categoriesWithCallbacks = filter(toolboxDefinition, "callback"),
    // { "Category Name": () -> { /* category callback */ }}
    categoriesObject = mapValues(keyBy(categoriesWithCallbacks, "name"), "callback"),
    renderedCategoryCallbacks = `const categoryCallbacks = ${ renderObject(categoriesObject) }`

  return renderTemplate(renderedCategoryCallbacks, './src/importer/toolbox.template.js')
}

export default BlocklyJSExporter
