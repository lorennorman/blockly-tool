import { keys, map, without } from 'lodash-es'
import Blockly from 'blockly'

import blockDefaults from './defaults.js'
import ALL_BLOCKS from './all.js'
import { toBlockJSON } from '../tools/tools.js'
import { getBlockType } from '../tools/util.js'


export const
  allBlockDefinitions = ALL_BLOCKS,
  customBlocksJson = [],
  allBlocksByCategory = {}

const processCommonBlock = commonBlock => {
  const { commonType } = commonBlock

  if(!Blockly.Blocks[commonType]) {
    throw new Error(`Common Block not found for type: ${commonType}`)
  }
}

const processCustomBlock = customBlock => {
  customBlocksJson.push({
      ...blockDefaults,
      ...customBlock.type
        ? toBlockJSON(customBlock)
        : customBlock.json
    })
}


map(ALL_BLOCKS, (block, key) => {
  const hasType = getBlockType(block)

  if(!hasType) { throw new Error(`No "type" declared for block: ${key}`) }

  block.commonType
    ? processCommonBlock(block) // built-in blocks
    : processCustomBlock(block) // our blocks
})
