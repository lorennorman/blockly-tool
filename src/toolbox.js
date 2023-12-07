import { allBlockCategories, allBlockLabels } from './blocks'


const
  SEP = '---',
  TOOLBOX_CONFIG = [
    { name: 'IO' },
    { name: 'Feeds', colour: '0' },
    { name: 'Triggers', colour: 52 },
    { name: 'Actions', colour: 104 },
    SEP,
    { name: 'Tools' },
    { name: 'Values', colour: 156 },
    { name: 'Comparisons', colour: 208 },
    // { name: 'Variables', colour: 208, extras: { custom: "VARIABLE" } },
    // { name: 'Math', colour: 260 },
    // { name: 'Transformers', colour: 285 },
    // { name: 'Logic', colour: 312 },
  ]

export default {
  kind: 'categoryToolbox',
  contents: TOOLBOX_CONFIG.reduce((acc, category, idx) => {
    if(category === SEP) {
      acc.push({ kind: 'sep' })

    } else {
      acc.push({
        kind: 'category',
        name: category.name,
        colour: category.colour,
        ...category.extras,
        contents: (allBlockCategories[category.name] || []).reduce((acc, type) => {
          // add tooltip as a toolbox label, if present
          allBlockLabels[type] && acc.push({ kind: 'label', text: allBlockLabels[type] })
          // add the block
          acc.push({ kind: 'block', type })
          return acc
        } , [])
      })
    }
    return acc
  }, [])
}
