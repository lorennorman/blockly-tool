import * as Blockly from 'blockly';

import * as action_root from './action_root'
import * as feed_selector from './feed_selector'
import * as trigger_all from './trigger_all'
import * as trigger_on_change from './trigger_on_change'
import * as action_publish_to_feed from './action_publish_to_feed'
import * as action_send_email from './action_send_email'
import * as math_number from './math_number'
import * as text from './text'
import * as text_multiline from './text_multiline'
import * as logic_boolean from './logic_boolean'
import * as logic_null from './logic_null'
import * as controls_if from './controls_if'
import * as logic_compare from './logic_compare'
import * as logic_negate from './logic_negate'
import * as logic_operation from './logic_operation'
import * as math_arithmetic from './math_arithmetic'


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
