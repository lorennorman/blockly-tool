import { compact, forEach, includes, isEmpty, isString, keyBy, keys, map, mapValues, filter, flatMap, reduce, without } from 'lodash-es'

import toolboxConfig from '../../app/toolbox/index.js'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


const
  DEBUG = true,
  log = (...messages) => DEBUG && console.log(...messages),
  warn = (...messages) => DEBUG && console.warn(...messages),
  error = (...messages) => DEBUG && console.error(...messages)

let
  blockDefinitionsByType = {},
  blockDefinitionsByCategory = {}

const
  importToolbox = async () => {
    blockDefinitionsByType = await importBlockDefinitions()
    blockDefinitionsByCategory = reduce(filter(blockDefinitionsByType, "toolbox"), (collection, definition) => {
      const category = definition.toolbox.category

      if(!collection[category]) {
        collection[category] = []
      }

      collection[category].push(definition)

      return collection
    }, {})

    log(`Processing Toolbox (DEBUG=true)`)

    return buildToolbox()
  },

  buildToolbox = () => ({
    kind: 'categoryToolbox',
    contents: generateToolboxContents()
  }),

  generateToolboxContents = () => map(toolboxConfig, category => {
    log(`- "${category.name}"`)

    validateCategoryDefinition(category)

    const
      contents = generateCategoryContents(category),
      contentKinds = map(contents, "kind"),
      blockCount = filter(contentKinds, kind => kind == "block").length,
      labelCount = filter(contentKinds, kind => kind == "label").length

    log(`  - ${blockCount} blocks added`)
    if(labelCount) {
      log(`  - ${labelCount} labels added`)
    }

    if(!contents.length) {
      warn(`  - Warning: generated no blocks!`)
    }

    // inject other kinds of toolbox objects here
    return {
      kind: 'category',
      name: category.name,
      colour: (category.colour === 0) ? "0" : category.colour,
      ...{
        custom: category.callback ? category.name : undefined
      },
      contents
    }
  }),

  EXPECTED_TOOLBOX_KEYS = [ "name", "colour", "contents", "callback" ],

  validateCategoryDefinition = definition => {
    const
      categoryKeys = keys(definition),
      unexpectedKeys = without(categoryKeys, ...EXPECTED_TOOLBOX_KEYS)

    if(unexpectedKeys.length) {
      warn(`  - Warning: Unexpected toolbox definition keys: "${unexpectedKeys.join(", ")}"`)
    }

    // contents and callback are mutually exclusive
    if(categoryKeys.includes("contents") && categoryKeys.includes("callback")) {
      warn(`  - Warning: Both "contents" and "callback" defined.`)
    }
  },

  generateCategoryContents = ({ name, label, contents }) => {
    const toolboxContents = []

    // prepend category label(s)
    if(label) {
      const labelArray = isString(label) ? [label] : label
      toolboxContents.push(...map(labelArray, makeLabel))
    }

    // if a category has a contents array, use that
    if(contents) {
      log(`  - using toolbox def`)

      const blockDefinitions = map(contents, findBlockByType)

      toolboxContents.push(...flatMap(blockDefinitions, blockDefinition => blockToLabelAndBlock(blockDefinition)))

      warnOnExtraBlocksSpecifyCategory(name, blockDefinitions)

      // otherwise add blocks by their toolbox.category
    } else {
      log(`  - using block def`)
      toolboxContents.push(...flatMap(blockDefinitionsByCategory[name] || [], blockToLabelAndBlock))
    }

    return toolboxContents
  },

  warnOnExtraBlocksSpecifyCategory = (categoryName, usedBlocks) => {
    const blocksToWarn = without(blockDefinitionsByCategory[categoryName], ...usedBlocks)

    if(blocksToWarn.length) {
      warn(`  - Warning: toolbox specifications ignored for blocks: "${map(blocksToWarn, 'type').join('", "')}"`)
    }
  },

  findBlockByType = type => {
    const blockDefinition = blockDefinitionsByType[type]

    if(!blockDefinition) {
      throw new Error(`No block found with type "${type}".`)
    }

    return blockDefinition
  },

  blockToLabelAndBlock = block => compact([
    {
      kind: 'block',
      type: block.type,
      inputs: blockToInputs(block),
      fields: blockToFields(block)
    }, block.toolbox.label
      ? makeLabel(block.toolbox.label)
      : null
  ]),

  makeLabel = text => ({ kind: 'label', text, "web-class": "my-label-style" }),

  blockToInputs = ({ lines }) => {
    if(!lines) { return }

    const inputs =
      mapValues(
        keyBy(
          filter(
            map(lines, '[1]'),
            "inputValue"),
          "inputValue"),
        shadowPropertyToInput)

    return isEmpty(inputs) ? undefined : inputs
  },

  blockToFields = ({ lines }) => {
    if(!lines) { return }
    // get every field that contains a "value" property
    const fields =
      reduce(
        map(
          filter(
            map(lines, '[1]'),
            "fields"),
          "fields"),
        (acc, fields) => {
          forEach(fields, (field, fieldKey) => {
            if(field.value){
              acc[fieldKey] = field.value
            }
          })

          return acc
        }, {})

    // produces:
    // {
    //   FIELD_NAME: field_value,
    //   ...
    // }
    return isEmpty(fields) ? undefined : fields
  },

  shadowPropertyToInput = ({ shadow }) =>
    isString(shadow) // is shorthand?
      ? { shadow: { type: shadow }} // expand to full object
      : { shadow } // set as shadow value

export default importToolbox

export const importToolboxJs = () => {
  const
    categoriesWithCallbacks = filter(toolboxConfig, "callback"),
    renderedCategoryCallbacks = `
const categoryCallbacks = {
  ${map(categoriesWithCallbacks, ({name, callback}) => `${name}: ${callback}`).join(',\n\n  ')}
}
  `
  return renderTemplate(renderedCategoryCallbacks, './src/importer/toolbox.template.js')
}
