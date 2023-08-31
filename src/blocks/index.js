import * as Blockly from 'blockly';

import action_root from './custom/action_root'
import feed_selector from './custom/feed_selector'
import trigger_all from './custom/trigger_all'
import trigger_on_change from './custom/trigger_on_change'
import action_publish_to_feed from './custom/action_publish_to_feed'
import action_send_email from './custom/action_send_email'

import math_number from './common/math_number'
import text from './common/text'
import text_multiline from './common/text_multiline'
import logic_boolean from './common/logic_boolean'
import logic_null from './common/logic_null'
import controls_if from './common/controls_if'
import logic_compare from './common/logic_compare'
import logic_negate from './common/logic_negate'
import logic_operation from './common/logic_operation'
import math_arithmetic from './common/math_arithmetic'
import variables_set from './common/variables_set'
import variables_get from './common/variables_get'
import math_change from './common/math_change'


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

    variables_set,
    variables_get,
    math_change,

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
