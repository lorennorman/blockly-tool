import { find, keys, map } from 'lodash-es'

import { importBlockJson } from './block_importer.js'
import importToolboxJson from './toolbox_importer.js'
import importWorkspaceJson from './workspace_importer.js'

import importBlocklyJs from './blockly_importer.js'


const PROCESSORS = {
  "/blocks.json": async () => JSON.stringify(await importBlockJson(), null, 2),
  "/toolbox.json": async () => JSON.stringify(await importToolboxJson(), null, 2),
  "/workspace.json": async () => JSON.stringify(await importWorkspaceJson(), null, 2),
  "/blockly.js": importBlocklyJs,
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
      if(ctx.file.includes("/test/")) { return }

      if(!ctx.file.includes('/app/') && !ctx.file.includes('/blockly_api.js')) {
        return
      }

      const mods = map(PROCESSED_FILES, file =>
        ctx.server.moduleGraph.getModuleById(`\0.${file}`))

      return ctx.modules.concat(mods)
    }
  }
}
