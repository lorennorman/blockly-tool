// build toolbox from a config and blocks that reference it
import { chain, forEach, includes, isString, keys, map, filter, values } from 'lodash-es'

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
      fields: blockToFields(block)
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

  blockToFields = (block) => {
    // get every field that contains a "value" property
    const fields = chain(block.lines)
        .map('[1]')
        .filter("fields") // TODO: also support "field" keys
        .map("fields")
        .reduce((acc, fields) => {
          forEach(fields, (field, fieldKey) => {
            if(field.value){
              acc[fieldKey] = field.value
            }
          })

          return acc
        }, {})
      .value()

    // produces:
    // {
    //   FIELD_NAME: field_value,
    //   ...
    // }
    return fields
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
