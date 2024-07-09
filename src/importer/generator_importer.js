import { map, mapValues } from 'lodash-es'
import { blockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


export default () => {
  const blockGenerators = mapValues(blockDefinitions, "generators")

  const renderedGenerators = `
const blockGenerators = {${map(blockGenerators, (generators, blockName) => `
  ${blockName}: {${map(generators, (func, name) => `
    ${name}: ${func}`).join(',\n')}
  }`).join(',\n')}
}`

  // render the generators template and return the output
  return renderTemplate(renderedGenerators, './src/importer/generators.template.js')
}
