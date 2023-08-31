import { allBlockCategories, allBlockLabels } from './blocks'

const SEP = '---'
const toolboxConfig = [
  { name: 'IO' },
  { name: 'Feeds', colour: '0' },
  { name: 'Triggers', colour: 52, contents: [ 'trigger_on_change' ] },
  { name: 'Actions', colour: 104 },
  SEP,
  { name: 'Tools' },
  { name: 'Values', colour: 156 },
  { name: 'Variables', colour: 208 },
  { name: 'Math', colour: 260 },
  { name: 'Logic', colour: 312 },
]

export default {
  kind: 'categoryToolbox',
  contents: toolboxConfig.reduce((acc, category, idx) => {
    if(category === SEP) {
      acc.push({ kind: 'sep' })

    // } else if(category.label) {
    //   acc.push({ kind: 'label', text: category.label })

    } else {
      const colour = category.colour// || Math.floor(idx*360/toolboxConfig.length).toString()
      acc.push({
        kind: 'category',
        name: category.name,
        colour,
        disabled: !!category.disabled,
        contents: (allBlockCategories[category.name] || []).reduce((acc, type) => {
          allBlockLabels[type] && acc.push({ kind: 'label', text: allBlockLabels[type] })
          acc.push({ kind: 'block', type })
          return acc
        } , [])
      })
    }
    return acc
  }, [])
}
