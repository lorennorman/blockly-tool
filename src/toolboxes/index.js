// build toolbox from a config and blocks that reference it
import { flatMap, includes, map, filter } from 'lodash-es'

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

  selectBlocksByCategoryName = name =>
    filter(allBlockDefinitions, def =>
      def.toolbox.category === name || includes(def.toolbox.categories, name)
    ),

  generateCategoryContents = ({ name }) => flatMap(
    selectBlocksByCategoryName(name), block => {
      const
        { inputs, fields } = block,
        type = getBlockType(block)

      // inject other kinds of cateogry objects here
      return { kind: 'block', type, ...{ inputs, fields } }
    }
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
