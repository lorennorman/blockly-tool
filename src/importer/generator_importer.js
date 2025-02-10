import { mapValues } from 'lodash-es'

import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'
import renderObject from './object_renderer.js'


export default async () => {
  const
    blockGenerators = mapValues(await importBlockDefinitions(), "generators"),
    renderedGenerators = `const blockGenerators = ${ renderObject(blockGenerators) }`

  // render the generators template and return the output
  return renderTemplate(renderedGenerators, './src/importer/generators.template.js')
}
