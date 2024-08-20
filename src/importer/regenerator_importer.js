import { map, mapValues } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


export default async () => {
  const blockRegenerators = mapValues(await importBlockDefinitions(), "regenerators")

  const renderRegenerators = () => `
const blockRegenerators = {${map(blockRegenerators, (regenerators, blockName) => `
  ${blockName}: {${map(regenerators, (func, name) => `
    ${name}: ${func}`).join(',\n')}
  }`).join(',\n')}
}
`

  // render the generators template and return the output
  return renderTemplate(renderRegenerators, './src/importer/regenerators.template.js')
}
