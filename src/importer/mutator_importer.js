import { forOwn, isString, isFunction, isArray, isNumber, isNull, isObject, map, mapValues, pickBy, isRegExp } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


const renderValue = value => {
  if (isString(value)) {
    return `"${value}"`

  } else if (isRegExp(value) || isNull(value) || isNumber(value) || value === false) {
    return value

  } else if (isFunction(value)) {
    return value.toString().replaceAll("\n", "\n  ")

  } else if (isArray(value)) {
    return `[ ${value.map(renderValue).join(", ")} ]`

  } else if (isObject(value)) {
    const lines = []
    forOwn(value, (val, key) => {
      lines.push(`"${key}": ${renderValue(val)}`)
    })
    return `{ ${lines.join(",\n")} }`

  } else {
    throw new Error(`Unexpected value type: ${value}`)
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
