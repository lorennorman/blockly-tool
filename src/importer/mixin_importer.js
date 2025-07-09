import { glob } from 'glob'
import { assign, camelCase, fromPairs, isArray, isString } from 'lodash-es'

import { importBlockDefinitions } from './block_importer.js'
import renderTemplate from './template_renderer.js'
import renderObject from './object_renderer.js'


const
  PROJECT_ROOT = process.cwd(),
  MIXIN_LOCATION = `app/mixins/`,

  gatherMixinFiles = async () => {
    const
      jsfiles = await glob(`./${MIXIN_LOCATION}**/*.js`, { ignore: [ '**/*example*.js' ] }),
      random = Math.random()*100000000 // break the import cache

    // loads app/mixins/mixin_name.js into object like:
    // { mixinName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}?key=${random}`)).default
      ]))
    ))
  }

export default async () => {
  const
    allMixins = await gatherMixinFiles(),
    blockDefMixins = Object.values(await importBlockDefinitions())
      .map(def => def.mixins)
      .filter(mix => mix)

  // merge top-level objects and objects nested under arrays
  blockDefMixins.forEach(mixinDef => {
    if(isArray(mixinDef)) {
      mixinDef.forEach( item => {
        // ignore strings
        if(!isString(item)) {
          // assign all the keys of a nested object
          assign(allMixins, item)
        }
      })
    } else {
      // assign all the keys of a top-level object
      assign(allMixins, mixinDef)
    }
  })

  const renderedMixins = `const allMixins = ${renderObject(allMixins)}`

  // render the mixins template and return the output
  return renderTemplate(renderedMixins, './src/importer/mixins.template.js')
}
