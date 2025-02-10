import { glob } from 'glob'
import { assign, camelCase, fromPairs, isArray } from 'lodash-es'

import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'
import renderObject from './object_renderer.js'


const
  PROJECT_ROOT = process.cwd(),
  EXTENSION_LOCATION = `app/extensions/`,

  gatherExtensionFiles = async () => {
    const
      jsfiles = await glob(`./${EXTENSION_LOCATION}**/*.js`, { ignore: [ '**/*example*.js' ] }),
      random = Math.random()*100000000 // break the import cache

    // loads app/extensions/extension_name.js into object like:
    // { extensionName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}?key=${random}`)).default
      ]))
    ))
  }

export default async () => {
  const
    fileExtensions = await gatherExtensionFiles(),
    allExtensions = Object.values(await importBlockDefinitions())
      .map(def => def.extensions)
      .filter(ext => ext && !isArray(ext))
      .reduce(assign, fileExtensions)


  const renderedExtensions = `const allExtensions = ${ renderObject(allExtensions) }`

  // render the extensions template and return the output
  return renderTemplate(renderedExtensions, './src/importer/extensions.template.js')
}
