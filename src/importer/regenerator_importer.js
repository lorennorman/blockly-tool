import { map, mapValues } from 'lodash-es'
import { blockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


export default () => {
  const blockRegenerators = mapValues(blockDefinitions, "regenerators")

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
