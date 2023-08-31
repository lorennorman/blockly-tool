import * as Blockly from 'blockly';

import * as trigger_on_change from './trigger_on_change'


const
  ALL_BLOCKS = {
    trigger_on_change
  },
  jsonGenerator = new Blockly.Generator('JSON'),
  markdownGenerator = new Blockly.Generator('markdown')

export const
  allBlocksJson = [],
  allBlockCategories = {},
  allBlockLabels = {},
  allGenerators = {
    json: jsonGenerator,
    markdown: markdownGenerator,
  }

Object.keys(ALL_BLOCKS).map(key => {
  const { json, toolbox, generators } = ALL_BLOCKS[key]

  // aggregate block JSON
  allBlocksJson.push(json)

  // sort blocks into their declared categories
  const { label, category, categories=[] } = toolbox
  categories.concat([category]).forEach(category => {
    allBlockCategories[category] = (allBlockCategories[category] || [])
    allBlockCategories[category].push(json.type)
  })

  if(label) {
    allBlockLabels[json.type] = label
  }

  // register generators
  jsonGenerator.forBlock[json.type] = block => generators.json(block, jsonGenerator)
  markdownGenerator.forBlock[json.type] = block => generators.markdown(block, markdownGenerator)
})
