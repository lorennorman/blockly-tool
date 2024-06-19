import { assign, isArray, map, mapValues, keys, pickBy, without } from 'lodash-es'
import Blockly from 'blockly'

import blockDefaults from './defaults.js'
import ALL_BLOCKS from './all.js'
import { toBlockJSON } from '../tools/index.js'


export const
  allBlockDefinitions = ALL_BLOCKS,
  customBlocksJson = [],
  allBlocksByCategory = {},
  allBlockGenerators = mapValues(allBlockDefinitions, "generators"),
  allBlockRegenerators = mapValues(allBlockDefinitions, "regenerators"),
  allBlockMutators = pickBy(mapValues(allBlockDefinitions, "mutator")),
  allBlockExtensions = Object.values(allBlockDefinitions)
    .map(def => def.extensions)
    .filter(ext => ext && !isArray(ext))
    .reduce(assign, {})

const
  COMMON_KEYS = [
    "type",
    "toolbox",
    "generators",
    "regenerators"
  ],

  CUSTOM_KEYS = COMMON_KEYS.concat([
    "toolbox",
    "visualization",
    "extensions",
    "mutator",
    "connections",
    "lines"
  ]),

  isCommonBlockType = type => !!Blockly.Blocks[type],

  processCommonBlock = commonBlock => {
    // ensure only supported keys are present
    const extraKeys = without(keys(commonBlock), ...COMMON_KEYS)

    if(extraKeys.length) {
      throw new Error(`Common Block definition has unrecognized keys: "${extraKeys.join('", "')}"\nBlock: ${JSON.stringify(commonBlock, null, 2)}`)
    }
  },

  processCustomBlock = customBlock => {
    // ensure only supported keys are present
    const extraKeys = without(keys(customBlock), ...CUSTOM_KEYS)

    if(extraKeys.length) {
      throw new Error(`Common Block definition has unrecognized keys: "${extraKeys.join('", "')}"\nBlock: ${JSON.stringify(customBlock, null, 2)}`)
    }

    customBlocksJson.push({
      ...blockDefaults,
      ...toBlockJSON(customBlock)
    })
  }


// walk the blocks and process them into the exported collections
map(ALL_BLOCKS, (block, key) => {
  if(!block.type) { throw new Error(`No "type" declared for block: ${key}`) }

  isCommonBlockType(block.type)
    ? processCommonBlock(block) // built-in blocks
    : processCustomBlock(block) // our blocks
})
