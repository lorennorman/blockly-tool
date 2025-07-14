import { readFileSync, writeFileSync } from 'fs'
import { filter, isString, keyBy, mapValues } from 'lodash-es'

import renderTemplate from '#src/importer/template_renderer.js'
import renderObject from '#src/importer/object_renderer.js'


const section = (title, contents) => `
///////////
// ${title}
///////////
${contents}
`

export default class ScriptExporter {
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
      scriptContents = [
        "import Blockly from 'blockly'\n\n",
        section("Toolbox", exportToolboxJs(this.definitionSet.primaryToolbox())),
        section("Mixins", exportMixinJs(this.definitionSet.mixins)),
        section("Extensions", exportExtensionJs(this.definitionSet.extensions)),
        section("Mutators", exportMutatorJs(this.definitionSet.mutators)),
        section("Generators", exportGeneratorJs(this.definitionSet.generators)),
        section("Regenerators", exportRegeneratorJs(this.definitionSet.regenerators)),
        section("Blockly API Wrapper", readFileSync(`./src/importer/blockly_api.js`))
      ].join("")

    if(!options.toFile) {
      return scriptContents
    }

    const filename = isString(options.toFile)
      ? options.toFile
      : `blockly_app.js`

    writeFileSync(`${this.destination}/${filename}`, scriptContents)
  }

  exportToFile = (toFile=true) => {
    this.export({ toFile })
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
