import { find } from 'lodash-es'

import importBlockJson from './importer/block_importer.js'
import toolboxJson from './importer/toolbox_importer.js'
import workspaceJson from './importer/workspace_importer.js'

import importExtensions from './importer/extension_importer.js'
import importGenerators from './importer/generator_importer.js'
import importRegenerators from './importer/regenerator_importer.js'


const compileBlockJSON = async () => {
  console.log("Compiling blocks...")

  return `export default ${JSON.stringify(await importBlockJson(), null, 2)}`
}

const JSON_WRAPPERS = {
  "/blocks.json": compileBlockJSON,
  "/toolbox.json": async () => `export default ${JSON.stringify(toolboxJson, null, 2)}`,
  "/workspace.json": async () => `export default ${JSON.stringify(workspaceJson, null, 2)}`,
}

const JS_WRAPPERS = {
  "/generators.js": importGenerators,
  "/extensions.js": importExtensions,
  // "/mutators.js": importMutators,
  "/regenerators.js": importRegenerators,
}

const findJsonProcessor = id => find(JSON_WRAPPERS, (_, fileEnding) => id.endsWith(fileEnding))

const findJsProcessor = id => find(JS_WRAPPERS, (_, fileEnding) => id.endsWith(fileEnding))
const prependVirtual = id => findJsProcessor(id) && `\0${id}`

export default function ImportUserAppPlugin() {
  return {
    name: 'import-app-files',

    resolveId(id) { return prependVirtual(id) },

    load(id) {
      const processor = findJsProcessor(id)

      if (processor) {
        console.log('processing:', id.split('/').at(-1))

        return processor()
      }
    },

    async transform(src, id) {
      const processor = findJsonProcessor(id)

      if (processor) {
        console.log('processing:', id.split('/').at(-1))

        return {
          code: await processor(src),
          map: null, // sourcemap
        }
      }
    },
  }
}
