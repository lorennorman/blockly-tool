import { mapValues } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'
import renderObject from './object_renderer.js'


export default async () => {
  const
    blockRegenerators = mapValues(await importBlockDefinitions(), "regenerators"),
    renderedRegenerators = `const blockRegenerators = ${ renderObject(blockRegenerators) }`

  return renderTemplate(renderedRegenerators, './src/importer/regenerators.template.js')
}
