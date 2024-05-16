import Blockly from 'blockly'

/* LOCAL->> */
import { isString, isFunction, map } from 'lodash-es'
import { allBlockMutators } from '../blocks/index.js'


const renderValue = value => {
  if(isString(value)) {
    return `"${value}"`
  } else if(isFunction) {
    return value.toString().replaceAll("\n", "\n  ")
  } else {
    return value
  }
}

const renderMutator = mutator => {
  return `{\n    ${map(mutator, (value, key) => `${key}: ${renderValue(value)}`).join(',\n\n    ')}\n  }`
}

// replaces this entire block with this source
export const renderedMutators = `
const allBlockMutators = {
  ${map(allBlockMutators, (mutatorObject, key) => `${key}: ${renderMutator(mutatorObject)}`).join(',\n\n  ')}
}
`
/* <<-LOCAL */


for (const [blockName, mutatorObject] of Object.entries(allBlockMutators)) {
  if(mutatorObject.helperFunction) {
    Blockly.Extensions.registerMutator(blockName, mutatorObject, mutatorObject.helperFunction)
  } else {
    Blockly.Extensions.registerMutator(blockName, mutatorObject)
  }
}

export default {}
