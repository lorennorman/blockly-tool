import { find } from 'lodash-es'

import importBlockJson from './importer/block_importer.js'
import toolboxJson from './importer/toolbox_importer.js'
import workspaceJson from './importer/workspace_importer.js'

import importExtensions from './importer/extension_importer.js'
import importMutators from './importer/mutator_importer.js'
import importGenerators from './importer/generator_importer.js'
import importRegenerators from './importer/regenerator_importer.js'


const blockJson = await importBlockJson()

const PROCESSORS = {
  "/blocks.json": () => JSON.stringify(blockJson, null, 2),
  "/toolbox.json": () => JSON.stringify(toolboxJson, null, 2),
  "/workspace.json": () => JSON.stringify(workspaceJson, null, 2),
  "/extensions.js": importExtensions,
  "/mutators.js": importMutators,
  "/generators.js": importGenerators,
  "/regenerators.js": importRegenerators,
}

const findAnyProcessor = id => find(PROCESSORS, (_, fileEnding) => id.endsWith(fileEnding))

const prependVirtual = id => findAnyProcessor(id) && `\0${id}`

export default function ImportUserAppPlugin() {
  return {
    name: 'import-app-files',

    resolveId(id) { return prependVirtual(id) },

    load(id) {
      const processor = findAnyProcessor(id)

      if(!processor) { return }

      console.log('Generating:', id.split('/').at(-1))
      return processor()
    },
  }
}
