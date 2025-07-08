import { compact, forEach, identity, isEmpty, isString, keyBy, keys, map, mapValues, filter, flatMap, pickBy, reduce, without } from 'lodash-es'

import toolboxConfig from '../../app/toolbox/index.js'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'
import renderObject from './object_renderer.js'


const
  DEBUG = false,
  WARN = true,
  log = (...messages) => DEBUG && console.log(...messages),
  warn = (...messages) => (DEBUG || WARN) && console.warn(...messages),
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
    if(category.name) {
      return generateCategoryFromDefinition(category)
    }

    return category
  }),

  generateCategoryFromDefinition = category => {
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

    if(!contents.length && !category.callback) {
      warn(`  - Warning: no blocks generated for category without callback "${category.name}"!`)
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
  },

  EXPECTED_TOOLBOX_KEYS = [ "name", "colour", "label", "contents", "callback", "usesBlocks" ],

  validateCategoryDefinition = definition => {
    const
      categoryKeys = keys(definition),
      unexpectedKeys = without(categoryKeys, ...EXPECTED_TOOLBOX_KEYS)

    if(unexpectedKeys.length) {
      warn(`  - Warning: Unexpected toolbox definition keys: "${unexpectedKeys.join(", ")}"`)
    }

    // callback precludes contents and label
    if(categoryKeys.includes("callback")) {
      if(categoryKeys.includes("contents")) {
        warn(`  - Warning: "contents" defined on toolbox category with a "callback" defined.`)
      }
      if(categoryKeys.includes("label")) {
        warn(`  - Warning: "contents" defined on toolbox category with a "label" defined.`)
      }
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
    }, block.toolbox?.label
      ? makeLabel(block.toolbox.label)
      : null
  ]),

  makeLabel = text => ({ kind: 'label', text }),

  blockToInputs = ({ lines, inputs }) => {
    if(lines) {
      const inputValues =
        mapValues(
          keyBy(
            filter(
              map(lines, '[1]'),
              "inputValue"),
            "inputValue"),
          definitionPropsToInputs)

      return isEmpty(inputValues) ? undefined : inputValues
    }

    if(inputs) {
      const inputValues = mapValues(inputs, definitionPropsToInputs)

      return isEmpty(inputValues) ? undefined : inputValues
    }
  },

  // produces:
  // {
  //   FIELD_NAME: field_value,
  //   ...
  // }
  blockToFields = ({ lines, fields }) => {
    if(lines) {
      // get every field that contains a "value" property
      const defaultFields =
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

      return isEmpty(defaultFields) ? undefined : defaultFields
    }

    if(fields) {
      const defaultFields = pickBy(mapValues(fields, "value"), identity)

      return isEmpty(defaultFields) ? undefined : defaultFields
    }
  },

  definitionPropsToInputs = ({ inputValue, block, shadow }) => {
    if(!block && !shadow) {
      console.warn("Warning: no block or shadow specified for", inputValue)
      return
    }

    if(block) {
      const
        blockJson = blockToInput(block),
        shadowJson = shadowToInput(shadow || block)

      return {
        ...blockJson,
        ...shadowJson
      }

    } else if(shadow) {
      return shadowToInput(shadow)
    }
  },

  blockToInput = block => isString(block) // is shorthand?
    ? { block: { type: block }} // expand to full object
    : { block }, // set as shadow value

  shadowToInput = shadow => isString(shadow) // is shorthand?
    ? { shadow: { type: shadow }} // expand to full object
    : { shadow } // set as shadow value

export default importToolbox

export const importToolboxJs = () => {
  const
    categoriesWithCallbacks = filter(toolboxConfig, "callback"),
    // { "Category Name": () -> { /* category callback */ }}
    categoriesObject = mapValues(keyBy(categoriesWithCallbacks, "name"), "callback"),
    renderedCategoryCallbacks = `const categoryCallbacks = ${ renderObject(categoriesObject) }`

  return renderTemplate(renderedCategoryCallbacks, './src/importer/toolbox.template.js')
}
