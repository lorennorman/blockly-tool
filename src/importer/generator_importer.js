import { map, mapValues } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


export const importGenerators = async () => mapValues(await importBlockDefinitions(), "generators")

export default async () => {
  const blockGenerators = await importGenerators()

  const renderedGenerators = `
const blockGenerators = {${map(blockGenerators, (generators, blockName) => `
  ${blockName}: {${map(generators, (func, name) => `
    ${name}: ${func}`).join(',\n')}
  }`).join(',\n')}
}`

  // render the generators template and return the output
  return renderTemplate(renderedGenerators, './src/importer/generators.template.js')
}
