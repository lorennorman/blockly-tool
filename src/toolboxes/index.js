// build toolbox from a config and blocks that reference it
import { compact, forEach, includes, isEmpty, isString, keyBy, map, mapValues, filter, flatMap, reduce } from 'lodash-es'

import { allBlockDefinitions } from '../blocks/index.js'


const
  SEP = '---',
  TOOLBOX_CONFIG = [
    { name: 'Logic', colour: 60 },
    { name: 'Math', colour: 120 },
    { name: 'Text', colour: 180 },
    { name: 'Variables', colour: 240 },
    { name: 'Feeds', colour: 300 },
    SEP,
    {
      kind: 'search',
      name: 'Search',
      contents: [],
    }
  ],

  generateToolboxContents = () => map(TOOLBOX_CONFIG, category =>
    // inject other kinds of toolbox objects here
    category === SEP
      ? { kind: 'sep' }
      : category.kind === 'search'
      ? category
      : {
          kind: 'category',
          name: category.name,
          colour: (category.colour === 0) ? "0" : category.colour,
          ...category.extras,
          contents: generateCategoryContents(category)
        }
  ),

  generateCategoryContents = ({ name }) =>
    flatMap(selectBlocksByCategoryName(name), blockToLabelAndBlock),

  generateAllBlocks = () =>
    flatMap(allBlockDefinitions, blockToLabelAndBlock),

  selectBlocksByCategoryName = name =>
    filter(allBlockDefinitions, def =>
      def.toolbox.category === name || includes(def.toolbox.categories, name)
    ),

  blockToLabelAndBlock = block => compact([
    {
      kind: 'block',
      type: block.type,
      inputs: blockToInputs(block),
      fields: blockToFields(block)
    }, block.toolbox.label
      ? { kind: 'label',
          text: block.toolbox.label
        }
      : null
  ]),

  blockToInputs = ({ lines }) => {
    if(!lines) { return }

    const inputs =
      mapValues(
        keyBy(
          filter(
            map(lines, '[1]'),
            "inputValue"),
          "inputValue"),
        shadowPropertyToInput)

    return isEmpty(inputs) ? undefined : inputs
  },

  blockToFields = ({ lines }) => {
    if(!lines) { return }
    // get every field that contains a "value" property
    const fields =
      reduce(
        map(
          filter(
            map(lines, '[1]'),
            "fields"),
          "fields"),
        (acc, fields) => {
          forEach(fields, (field, fieldKey) => {
            if(field.value){
              acc[fieldKey] = field.value
            }
          })

          return acc
        }, {})

    // produces:
    // {
    //   FIELD_NAME: field_value,
    //   ...
    // }
    return isEmpty(fields) ? undefined : fields
  },

  shadowPropertyToInput = ({ shadow }) =>
    isString(shadow) // is shorthand?
      ? { shadow: { type: shadow }} // expand to full object
      : { shadow } // set as shadow value

export const toolbox = {
  // Use given categories, fill them with blocks that declare those categories
  kind: 'categoryToolbox',
  contents: generateToolboxContents()

  // No categories, just a gutter full of blocks
  // kind: 'flyoutToolbox',
  // contents: generateAllBlocks()
}


export default toolbox
