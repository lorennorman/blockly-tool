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
    const { blocks, toolbox, workspace, mixins, extensions, mutators, generators, regenerators } = options

    // return importBlocklyJs()

    return [
      "import Blockly from 'blockly'\n\n",
      section("Toolbox", exportToolboxJs(toolbox)),
      section("Mixins", exportMixinJs(mixins)),
      section("Extensions", exportExtensionJs(extensions)),
      section("Mutators", exportMutatorJs(mutators)),
      section("Generators", exportGeneratorJs(generators)),
      section("Regenerators", exportRegeneratorJs(regenerators)),
      section("Blockly API Wrapper", readFileSync(`./src/importer/blockly_api.js`))
    ].join("")
  }
}

const
  exportToolboxJs = toolboxDefinition => {
    const
      categoriesWithCallbacks = filter(toolboxDefinition.categories, "callback"),
      // { "Category Name": () -> { /* category callback */ }}
      categoriesObject = mapValues(keyBy(categoriesWithCallbacks, "name"), "callback"),
      renderedCategoryCallbacks = `const categoryCallbacks = ${ renderObject(categoriesObject) }`

    return renderTemplate(renderedCategoryCallbacks, './src/importer/toolbox.template.js')
  },

  exportMixinJs = mixins => {
    const renderedMixins = `const allMixins = ${renderObject(mixins)}`
    // render the mixins template and return the output
    return renderTemplate(renderedMixins, './src/importer/mixins.template.js')
  },

  exportExtensionJs = extensions => {
    const renderedExtensions = `const allExtensions = ${ renderObject(extensions) }`
    // render the extensions template and return the output
    return renderTemplate(renderedExtensions, './src/importer/extensions.template.js')
  },

  exportMutatorJs = mutators => {
    // write the javascript into a string
    const renderedMutators = `const allBlockMutators = ${ renderObject(mutators) }`
    // render the mutators template and return the output
    return renderTemplate(renderedMutators, './src/importer/mutators.template.js')
  },

  exportGeneratorJs = generators => {
    // write the javascript into a string
    const renderedGenerators = `const blockGenerators = ${ renderObject(generators) }`
    // render the generators template and return the output
    return renderTemplate(renderedGenerators, './src/importer/generators.template.js')
  },

  exportRegeneratorJs = regenerators => {
    // write the javascript into a string
    const renderedRegenerators = `const blockRegenerators = ${ renderObject(regenerators) }`

    return renderTemplate(renderedRegenerators, './src/importer/regenerators.template.js')
  }


export default BlocklyJSExporter
