import { compact, forEach, includes, isEmpty, isString, keyBy, map, mapValues, filter, flatMap, reduce } from 'lodash-es'

import toolboxConfig from '../../app/toolbox/index.js'
import { importBlockDefinitions } from './block_importer.js'


let blocksByCategory = {}

const
  SEP = '---',

  importToolbox = async () => {
    const blockDefinitions = await importBlockDefinitions()
    blocksByCategory = reduce(filter(blockDefinitions, "toolbox"), (collection, definition) => {
        const category = definition.toolbox.category

        if(!collection[category]) {
          collection[category] = []
        }

        collection[category].push(definition)

        return collection
      }, {})

    return buildToolbox()
  },

  buildToolbox = () => ({
    kind: 'categoryToolbox',
    contents: generateToolboxContents()
  }),

  generateToolboxContents = () => map(toolboxConfig, category =>
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
    flatMap(blocksByCategory[name] || [], blockToLabelAndBlock),

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

export default importToolbox
