import Blockly from 'blockly'

import ALL_BLOCKS from './all.js'
import generators from './generators.js'


export const
  allBlocksJson = [],
  allBlocksByCategory = {},
  allBlockLabels = {},
  allGenerators = generators

Object.keys(ALL_BLOCKS).map(key => {
  const
    block = ALL_BLOCKS[key],
    { json={}, commonType, toolbox, generators } = block,
    type = commonType || json.type

  if(!type) { throw new Error(`No "type" declared for block: ${key}`) }

  // built-in blocks
  if(commonType) {
    if(!Blockly.Blocks[commonType]) {
      throw new Error(`Common Block not found for type: ${commonType}`)
    }

  // custom blocks
  } else {
    allBlocksJson.push(json)
  }

  // sort blocks into their declared categories
  const { category, categories=[] } = toolbox
  categories.concat([category]).forEach(category => {
    allBlocksByCategory[category] = (allBlocksByCategory[category] || {})
    allBlocksByCategory[category][type] = block
  })

  // toolbox labels
  if(json.tooltip) {
    allBlockLabels[type] = json.tooltip
  }
})
