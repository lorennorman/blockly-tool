import * as Blockly from 'blockly';

import action_root from './action_root'
import feed_selector from './feed_selector'
import trigger_all from './trigger_all'
import trigger_on_change from './trigger_on_change'
import action_publish_to_feed from './action_publish_to_feed'
import action_send_email from './action_send_email'
import math_number from './math_number'
import text from './text'
import text_multiline from './text_multiline'
import logic_boolean from './logic_boolean'
import logic_null from './logic_null'
import controls_if from './controls_if'
import logic_compare from './logic_compare'
import logic_negate from './logic_negate'
import logic_operation from './logic_operation'
import math_arithmetic from './math_arithmetic'


const
  ALL_BLOCKS = {
    action_root,

    feed_selector,

    trigger_all,
    trigger_on_change,

    action_publish_to_feed,
    action_send_email,

    math_number,
    text,
    text_multiline,
    logic_boolean,
    logic_null,

    math_arithmetic,

    controls_if,
    logic_compare,
    logic_operation,
    logic_negate,
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
