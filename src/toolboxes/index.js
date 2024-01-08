// build toolbox from a config and blocks that reference it
import { chain, includes, isString, keys, map, filter } from 'lodash-es'

import { allBlockDefinitions } from '../blocks/index.js'


const
  SEP = '---',
  TOOLBOX_CONFIG = [
    { name: 'Triggers', colour: 52 },
    { name: 'Actions', colour: 104 },
    SEP,
    { name: 'Feeds', colour: 0 },
    { name: 'Schedules', colour: 232 },
    { name: 'Values', colour: 156 },
    { name: 'Comparisons', colour: 208 },
  ],

  generateToolboxContents = () => map(TOOLBOX_CONFIG, category =>
    // inject other kinds of toolbox objects here
    category === SEP
      ? { kind: 'sep' }
      : {
          kind: 'category',
          name: category.name,
          colour: (category.colour === 0) ? "0" : category.colour,
          ...category.extras,
          contents: generateCategoryContents(category)
        }
  ),

  generateCategoryContents = ({ name }) =>
    map(selectBlocksByCategoryName(name), block => ({
      kind: 'block',
      type: block.type,
      inputs: blockToInputs(block),
      // fields: {}
    })),

  selectBlocksByCategoryName = name =>
    filter(allBlockDefinitions, def =>
      def.toolbox.category === name || includes(def.toolbox.categories, name)
    ),

  blockToInputs = ({ lines }) => {
    const inputs = chain(lines)
        .map('[1]')
        .filter("inputValue")
        .keyBy("inputValue")
        .mapValues(shadowPropertyToInput)
      .value()

    return keys(inputs).length
      ? inputs
      : undefined
  },

  shadowPropertyToInput = ({ shadow }) =>
    isString(shadow) // is shorthand?
      ? { shadow: { type: shadow }} // expand to full object
      : { shadow } // set as shadow value

export const toolbox = {
  kind: 'categoryToolbox',
  contents: generateToolboxContents()
}

export default toolbox
