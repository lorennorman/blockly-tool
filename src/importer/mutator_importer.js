import { isString, isFunction, map, mapValues, pickBy } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


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

export default async () => {
  const mutators = pickBy(mapValues(await importBlockDefinitions(), "mutator"))

  const renderedMutators = `
const allBlockMutators = {
  ${map(mutators, (mutatorObject, key) => `${key}: ${renderMutator(mutatorObject)}`).join(',\n\n  ')}
}`

  // render the extensions template and return the output
  return renderTemplate(renderedMutators, './src/importer/mutators.template.js')
}
