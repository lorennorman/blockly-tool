import { glob } from 'glob'
import { camelCase, fromPairs } from 'lodash-es'


const
  PROJECT_ROOT = process.cwd(),

  BLOCK_LOCATION = `app/blocks/`,
  EXTENSION_LOCATION = `app/extensions/`,
  MIXIN_LOCATION = `app/mixins/`,
  MUTATOR_LOCATION = `app/mutators/`,
  TOOLBOX_LOCATION = `app/toolbox/`,
  WORKSPACE_LOCATION = `app/workspace/`,

  EXAMPLE_FILES = [ '**/*example*.js' ],
  NON_BLOCK_FILES = [
    '**/*extension*.js',
    '**/*mixin*.js',
    '**/*mutator*.js',
    '**/*shadow*.js'
  ].concat(EXAMPLE_FILES)

export const DefinitionLoader = {
  loadMutators: async () => {
    const jsfiles = await glob(`./${MUTATOR_LOCATION}**/*.js`, { ignore: EXAMPLE_FILES })

    // loads app/mutators/mutator_name.js into object like:
    // { mutatorName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}`)).default
      ]))
    ))
  },

  loadMixins: async () => {
    const jsfiles = await glob(`./${MIXIN_LOCATION}**/*.js`, { ignore: EXAMPLE_FILES })

    // loads app/mixins/mixin_name.js into object like:
    // { mixinName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}`)).default
      ]))
    ))
  },

  loadExtensions: async () => {
    const jsfiles = await glob(`./${EXTENSION_LOCATION}**/*.js`, { ignore: EXAMPLE_FILES })

    // loads app/extensions/extension_name.js into object like:
    // { extensionName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}`)).default
      ]))
    ))
  },

  loadBlocks: async () => {
    // get the file listing
    const jsfiles = await glob(`./${BLOCK_LOCATION}**/*.js`, { ignore: NON_BLOCK_FILES })
    // load each file
    return Promise.all(
      jsfiles.map(
        async filePath => ({
          definition: (await import(`${PROJECT_ROOT}/${filePath}`)).default,
          path: filePath.slice(BLOCK_LOCATION.length)
        })
      )
    )
  },

  loadToolboxes: async () => {
    // hardcode to a single toolbox for now
    const rawToolboxDef = (await import(`${PROJECT_ROOT}/${TOOLBOX_LOCATION}index.js`)).default
    return [ rawToolboxDef ]
  },

  loadWorkspaces: async () => {
    // hardcode to a single workspace for now
    const rawWorkspaceDef = (await import(`${PROJECT_ROOT}/${WORKSPACE_LOCATION}workspace.json`, { with: { type: 'json' }})).default
    return [ rawWorkspaceDef ]
  },

  loadAll: async () => {
    return {
      mutators: await DefinitionLoader.loadMutators(),
      mixins: await DefinitionLoader.loadMixins(),
      extensions: await DefinitionLoader.loadExtensions(),
      blocks: await DefinitionLoader.loadBlocks(),
      toolboxes: await DefinitionLoader.loadToolboxes(),
      workspaces: await DefinitionLoader.loadWorkspaces(),
    }
  }
}

export default DefinitionLoader
