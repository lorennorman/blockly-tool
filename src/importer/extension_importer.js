import { assign, isArray, map } from 'lodash-es'
import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'


export default async () => {
  const allExtensions = Object.values(await importBlockDefinitions())
    .map(def => def.extensions)
    .filter(ext => ext && !isArray(ext))
    .reduce(assign, {})

  const renderedExtensions = `
const allExtensions = {
  ${map(allExtensions, (func, key) => `${key}: ${func}`).join(',\n\n  ')}
}`

  // render the extensions template and return the output
  return renderTemplate(renderedExtensions, './src/importer/extensions.template.js')
}
