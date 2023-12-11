import Blockly from 'blockly'

import root_block from './custom/root_block.js'
import selector_feed from './custom/selector_feed.js'
import trigger_reactive from './custom/trigger_reactive.js'
import selector_comparison from './custom/selector_comparison.js'
import action_publish_to_feed from './custom/action_publish_to_feed.js'
import action_send_email from './custom/action_send_email.js'

import math_number from './common/math_number.js'
import text from './common/text.js'
import text_multiline from './common/text_multiline.js'
import logic_boolean from './common/logic_boolean.js'
import logic_null from './common/logic_null.js'


const
  ALL_BLOCKS = {
    // not in toolbox
    root_block,

    // IO

    // Feeds
    selector_feed,

    // Triggers
    trigger_reactive,
    // trigger_all,
    // trigger_on_change,

    // Actions
    action_publish_to_feed,
    action_send_email,

    // Tools

    // Values
    math_number,
    text,
    text_multiline,
    logic_boolean,
    logic_null,

    // Comparisons
    selector_comparison,

    // variables_set,
    // variables_get,
    // math_change,

    // math_arithmetic,

    // transform_regex,

    // controls_if,
    // logic_compare,
    // logic_operation,
    // logic_negate,
  },
  jsonGenerator = new Blockly.Generator('JSON'),
  markdownGenerator = new Blockly.Generator('markdown')

jsonGenerator.scrub_ = (block, previousJson, thisOnly) => {
  const nextBlock = block.nextConnection?.targetBlock()

  return nextBlock && !thisOnly
    ? `${ previousJson },\n${ jsonGenerator.blockToCode(nextBlock) }`
    : previousJson
}

export const
  allBlocksJson = [],
  allBlockCategories = {},
  allBlockLabels = {},
  allGenerators = {
    json: jsonGenerator,
    markdown: markdownGenerator,
  }

Object.keys(ALL_BLOCKS).map(key => {
  const
    { json={}, commonType, toolbox, generators } = ALL_BLOCKS[key],
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
    allBlockCategories[category] = (allBlockCategories[category] || [])
    allBlockCategories[category].push(type)
  })

  // toolbox labels
  if(json.tooltip) {
    allBlockLabels[type] = json.tooltip
  }

  // register generators
  jsonGenerator.forBlock[type] = block => generators.json(block, jsonGenerator)
  markdownGenerator.forBlock[type] = block => generators.markdown(block, markdownGenerator)
})
