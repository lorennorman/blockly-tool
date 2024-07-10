import { find, keys, map } from 'lodash-es'

import { importBlockJson } from './importer/block_importer.js'
import importToolboxJson from './importer/toolbox_importer.js'
import importWorkspaceJson from './importer/workspace_importer.js'

import importExtensionsJs from './importer/extension_importer.js'
import importMutatorsJs from './importer/mutator_importer.js'
import importGeneratorsJs from './importer/generator_importer.js'
import importRegeneratorsJs from './importer/regenerator_importer.js'


const PROCESSORS = {
  "/blocks.json": async () => JSON.stringify(await importBlockJson(), null, 2),
  "/toolbox.json": async () => JSON.stringify(await importToolboxJson(), null, 2),
  "/workspace.json": async () => JSON.stringify(await importWorkspaceJson(), null, 2),
  "/extensions.js": importExtensionsJs,
  "/mutators.js": importMutatorsJs,
  "/generators.js": importGeneratorsJs,
  "/regenerators.js": importRegeneratorsJs,
}
const PROCESSED_FILES = keys(PROCESSORS)

const findAnyProcessor = id => find(PROCESSORS, (_, fileEnding) => id.endsWith(fileEnding))

const prependVirtual = id => findAnyProcessor(id) && `\0${id}`

export default function ImportUserAppPlugin() {
  return {
    name: 'import-app-files',

    resolveId(id) { return prependVirtual(id) },

    load(id) {
      const processor = findAnyProcessor(id)

      if(!processor) { return }

      return processor()
    },

    handleHotUpdate(ctx) {
      if (!ctx.file.includes('/app/')) { return }

      const mods = map(PROCESSED_FILES, file =>
        ctx.server.moduleGraph.getModuleById(`\0.${file}`))

      return ctx.modules.concat(mods)
    }
  }
}
