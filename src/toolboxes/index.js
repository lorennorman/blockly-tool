// build toolbox from a config and blocks that reference it
import { chain, includes, isString, map, filter, mapValues } from 'lodash-es'

import { allBlockDefinitions } from '../blocks/index.js'
import { getBlockType } from '../tools/util.js'


const
  SEP = '---',
  TOOLBOX_CONFIG = [
    { name: 'Triggers', colour: 52 },
    { name: 'Actions', colour: 104 },
    SEP,
    { name: 'Feeds', colour: 0 },
    { name: 'Values', colour: 156 },
    { name: 'Comparisons', colour: 208 },
  ],

  shadowPropertyToInput = ({ shadow }) =>
    isString(shadow) // shorthand
      ? { shadow: { type: shadow }}
      : { shadow },

  blockToInputs = block =>
    (block.data?.inputValues
      // shadow processing
      ? mapValues(block.data?.inputValues, shadowPropertyToInput)
      : block.inputs)
    || (
      chain(block.lines)
        .map('[1]')
        .filter("inputValue")
        .keyBy("inputValue")
        .mapValues(shadowPropertyToInput)
      .value()
    ),

  blockToFields = block => {
    return block.fields
  },

  selectBlocksByCategoryName = name =>
    filter(allBlockDefinitions, def =>
      def.toolbox.category === name || includes(def.toolbox.categories, name)
    ),

  generateCategoryContents = ({ name }) =>
    map(selectBlocksByCategoryName(name), block => ({
      kind: 'block',
      type: getBlockType(block),
      inputs: blockToInputs(block),
      fields: blockToFields(block)
    })
  ),

  generateToolboxContents = () => map(TOOLBOX_CONFIG, category =>
    // inject other kinds of toolbox objects here
    category === SEP
      ? { kind: 'sep' }
      : {
          kind: 'category',
          name: category.name,
          colour: category.colour?.toString(),
          ...category.extras,
          contents: generateCategoryContents(category)
        }
  )

export const toolbox = {
  kind: 'categoryToolbox',
  contents: generateToolboxContents()
}

export default toolbox
