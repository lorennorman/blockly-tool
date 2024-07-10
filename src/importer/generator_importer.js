import { map, mapValues } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


export default async () => {
  const blockGenerators = mapValues(await importBlockDefinitions(), "generators")

  const renderedGenerators = `
const blockGenerators = {${map(blockGenerators, (generators, blockName) => `
  ${blockName}: {${map(generators, (func, name) => `
    ${name}: ${func}`).join(',\n')}
  }`).join(',\n')}
}`

  // render the generators template and return the output
  return renderTemplate(renderedGenerators, './src/importer/generators.template.js')
}
