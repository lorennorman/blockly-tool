import { keys, map, mapValues, sortBy } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


export default async () => {
  const
    blockGenerators = mapValues(await importBlockDefinitions(), "generators"),
    sortedKeys = sortBy(keys(blockGenerators))

  const renderedGenerators = `
const blockGenerators = {${map(sortedKeys, blockName => `
  ${blockName}: {${map(blockGenerators[blockName], (func, name) => `
    ${name}: ${func}`).join(',\n')}
  }`).join(',\n')}
}`

  // render the generators template and return the output
  return renderTemplate(renderedGenerators, './src/importer/generators.template.js')
}
