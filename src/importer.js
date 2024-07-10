import { find, keys, map } from 'lodash-es'

import { importBlockJson } from './importer/block_importer.js'
import toolboxJson from './importer/toolbox_importer.js'
import workspaceJson from './importer/workspace_importer.js'

import extensions_js from './importer/extension_importer.js'
import mutators_js from './importer/mutator_importer.js'
import generators_js from './importer/generator_importer.js'
import regenerators_js from './importer/regenerator_importer.js'


const PROCESSORS = {
  "/blocks.json": async () => JSON.stringify(await importBlockJson(), null, 2),
  "/toolbox.json": () => JSON.stringify(toolboxJson, null, 2),
  "/workspace.json": () => JSON.stringify(workspaceJson, null, 2),
  "/extensions.js": extensions_js,
  "/mutators.js": mutators_js,
  "/generators.js": generators_js,
  "/regenerators.js": regenerators_js,
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
