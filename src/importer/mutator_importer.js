import { mapValues, pickBy } from 'lodash-es'

import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'
import renderObject from './object_renderer.js'


export default async () => {
  // grab the value at the "mutator" key from all block defs, removing nulls
  const mutators = pickBy(mapValues(await importBlockDefinitions(), "mutator"))
  // write the javascript into a string
  const renderedMutators = `const allBlockMutators = ${ renderObject(mutators) }`
  // render the mutators template and return the output
  return renderTemplate(renderedMutators, './src/importer/mutators.template.js')
}
