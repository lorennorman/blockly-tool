import { capitalize, filter, invokeMap, map } from 'lodash-es'

import { toBlockJSON } from '#src/importer/block_processor/index.js'


const niceTemplate = tplString => {
  const
    lines = tplString.split("\n"),
    firstLineBlank = /^\s*$/.test(lines[0]),
    remainingLines = lines.slice(1, -1),
    indentCounts = map(remainingLines, line => line.search(/\S/)),
    firstLineLeastIndented = indentCounts[0] >= Math.min(...indentCounts.slice(1, -1))

  // ensure first line is blank and every other line has at least as much whitespace as the first line
  if(firstLineBlank && firstLineLeastIndented) {
    // drop the first line, remove X whitespace chars from the rest and join with newline
    return map(remainingLines, line => line.slice(indentCounts[0])).join("\n")
  }

  return tplString
}

class BlockDefinition {
  definitionSet = null

  definitionPath = null

  definitionJS = null

  type = null

  name = null

  description = ''

  colour = null
  color = null

  visualization = null

  inputsInline = false

  connections = null

  lines = null

  template = null

  inputs = []

  fields = []

  generators = {}

  regenerators = {}

  disabled = false

  categories = []


  getCategories() {
    return (this.definitionSet
      ? filter(this.definitionSet.getCategories(), ({ contents=[], usesBlocks=[]}) =>
          contents.includes(this.type) || usesBlocks.includes(this.type)
        )
      : [])
  }

  toBlocklyJSON() {
    return toBlockJSON(this)
  }

  toBlocklyJSONString() {
    return JSON.stringify(this.toBlocklyJSON(), null, 2) + "\n"
  }
}

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
  blockDef.tooltip = blockDef.description.split("\n")[0]
  blockDef.disabled = !!rawBlockDefinition.disabled
  blockDef.visualization = rawBlockDefinition.visualization
  blockDef.connections = rawBlockDefinition.connections
  blockDef.lines = rawBlockDefinition.lines
  blockDef.template = rawBlockDefinition.template
  blockDef.inputs = rawBlockDefinition.inputs
  blockDef.fields = rawBlockDefinition.fields
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
  return invokeMap(blockDefinitions, 'toBlocklyJSON')
}
