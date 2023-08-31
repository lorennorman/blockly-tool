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
import * as controls_if from './controls_if'
import * as logic_compare from './logic_compare'
import * as math_arithmetic from './math_arithmetic'


const
  ALL_BLOCKS = {
    action_root,

    feed_selector,

    trigger_all,
    trigger_on_change,

    action_publish_to_feed,
    action_send_email,

    controls_if,
    logic_compare,
    math_arithmetic,
    math_number,
    text,
    text_multiline,
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

  // aggregate block JSON
  if(Blockly.Blocks[commonType]) {
    console.log("common type:", commonType)
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
