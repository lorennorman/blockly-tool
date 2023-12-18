import { flatMap, map } from 'lodash-es'

import { allBlocksByCategory, allBlockLabels } from './blocks/index.js'


const
  SEP = '---',
  TOOLBOX_CONFIG = [
    // { name: 'IO' },
    { name: 'Triggers', colour: 52 },
    { name: 'Actions', colour: 104 },
    SEP,
    // { name: 'Tools' },
    { name: 'Feeds', colour: 0 },
    { name: 'Values', colour: 156 },
    { name: 'Comparisons', colour: 208 },
    // { name: 'Variables', colour: 208, extras: { custom: "VARIABLE" } },
    // { name: 'Math', colour: 260 },
    // { name: 'Transformers', colour: 285 },
    // { name: 'Logic', colour: 312 },
  ]

export default {
  kind: 'categoryToolbox',
  contents: map(TOOLBOX_CONFIG, category =>
    category === SEP
      ? { kind: 'sep' }
      : {
          kind: 'category',
          name: category.name,
          colour: category.colour?.toString(),
          ...category.extras,
          contents: flatMap(allBlocksByCategory[category.name] || {}, ({ inputs, fields }, type) => {
            const toolboxRows = []
            // add tooltip as a toolbox label, if present
            allBlockLabels[type] && toolboxRows.push({ kind: 'label', text: allBlockLabels[type] })
            // add the block. inputs and fields provide defaults, shadows, etc
            toolboxRows.push({ kind: 'block', type, ...{ inputs, fields } })
            return toolboxRows
          })
        }
  )
}
