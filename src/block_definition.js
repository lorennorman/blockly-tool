import { capitalize, filter, invokeMap, isString, map, sortBy, isEmpty, keyBy, mapValues, reduce, forEach, pickBy, identity } from 'lodash-es'

import { toBlockJSON } from '#src/importer/block_processor/index.js'
import { niceTemplate } from '#src/util.js'


class BlockDefinition {
  definitionSet = null

  definitionPath = null

  definitionJS = null

  type = null

  name = null

  description = ''
  docBlocks = null

  colour = null
  color = null

  visualization = null

  inputsInline = false

  connections = null

  lines = null

  template = null

  inputs = []
  fields = []

  mixins = []
  extensions = []
  mutator = null

  generators = {}

  regenerators = {}

  disabled = false

  categories = []


  getCategories() {
    return (this.definitionSet
      ? filter(this.definitionSet.getCategories(), ({ contents=[], usesBlocks=[]}) =>
          contents.includes(this) || usesBlocks.includes(this.type)
        )
      : [])
  }

  toBlocklyJSON() {
    return toBlockJSON(this)
  }

  toBlocklyJSONString() {
    return JSON.stringify(this.toBlocklyJSON(), null, 2) + "\n"
  }

  toBlocklyInstanceJSON() {
    return pickBy({
      type: this.type,
      inputs: this.getInstanceInputs(),
      fields: this.getInstanceFields(),
    }, identity)
  }

  getInstanceInputs() {
    const { lines, inputs } = this

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
  }

  getInstanceFields() {
    const { lines, fields } = this

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
  }
}

const
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

export default BlockDefinition


/** @returns BlockDefinition */
BlockDefinition.parseRawDefinition = function(rawBlockDefinition, definitionPath, definitionSet) {
  // throw on any problems
  if(!rawBlockDefinition.type) {
    throw new Error('BlockDefinition: A unique `type` property is required for block definitions.')
  }

  // defaults, desugars, localizations, transformations, assignments
  const blockDef = new BlockDefinition()
  blockDef.definitionPath = definitionPath
  blockDef.definitionSet = definitionSet
  blockDef.definitionJS = rawBlockDefinition
  blockDef.type = rawBlockDefinition.type
  blockDef.name = rawBlockDefinition.name
  blockDef.description = rawBlockDefinition.description
    ? niceTemplate(rawBlockDefinition.description)
    : ""
  blockDef.docBlocks = rawBlockDefinition.docBlocks
  blockDef.tooltip = blockDef.description.split("\n")[0]
  blockDef.disabled = !!rawBlockDefinition.disabled
  blockDef.visualization = rawBlockDefinition.visualization
  blockDef.connections = rawBlockDefinition.connections
  blockDef.lines = rawBlockDefinition.lines
  blockDef.template = rawBlockDefinition.template
  blockDef.inputs = rawBlockDefinition.inputs
  blockDef.fields = rawBlockDefinition.fields
  blockDef.mixins = rawBlockDefinition.mixins
  blockDef.extensions = rawBlockDefinition.extensions
  blockDef.mutator = rawBlockDefinition.mutator
  blockDef.generators = rawBlockDefinition.generators
  blockDef.regenerators = rawBlockDefinition.regenerators
  blockDef.colour = rawBlockDefinition.color || rawBlockDefinition.colour || rawBlockDefinition.visualization?.color || rawBlockDefinition.visualization?.colour || "0"
  blockDef.color = blockDef.colour
  blockDef.inputsInline = rawBlockDefinition.inputsInline || false

  // warnings on any data that's missing, ugly, etc
  if(!blockDef.name) {
    // if no name given, humanize the type property as a default
    console.warn(`No "name" property provided for block: "${rawBlockDefinition.type}" (${definitionPath})`)
    blockDef.name = rawBlockDefinition.type.split(/[\W_]+/).map(capitalize).join(" ").replace(/^io /i, "")
  }

  return blockDef
}

BlockDefinition.allToBlocklyJSONString = function(blockDefinitions) {
  return JSON.stringify(this.allToBlocklyJSON(blockDefinitions), null, 2) + "\n"
}

BlockDefinition.allToBlocklyJSON = function(blockDefinitions) {
  return invokeMap(sortBy(blockDefinitions, "type"), 'toBlocklyJSON')
}
