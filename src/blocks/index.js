import * as Blockly from 'blockly';

import * as action_root from './action_root'
import * as feed_selector from './feed_selector'
import * as trigger_all from './trigger_all'
import * as trigger_on_change from './trigger_on_change'
import * as action_publish_to_feed from './action_publish_to_feed'
import * as action_send_email from './action_send_email'


const
  ALL_BLOCKS = {
    action_root,
    feed_selector,
    trigger_all,
    trigger_on_change,
    action_publish_to_feed,
    action_send_email,
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
  const { category, categories=[] } = toolbox
  categories.concat([category]).forEach(category => {
    allBlockCategories[category] = (allBlockCategories[category] || [])
    allBlockCategories[category].push(json.type)
  })

  if(json.tooltip) {
    allBlockLabels[json.type] = json.tooltip
  }

  // register generators
  jsonGenerator.forBlock[json.type] = block => generators.json(block, jsonGenerator)
  markdownGenerator.forBlock[json.type] = block => generators.markdown(block, markdownGenerator)
})
