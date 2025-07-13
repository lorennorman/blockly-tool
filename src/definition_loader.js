import { glob } from 'glob'
import { camelCase, fromPairs } from 'lodash-es'


const
  PROJECT_ROOT = process.cwd(),

  APP_LOCATION = 'app',

  BLOCK_LOCATION = `blocks/`,
  EXTENSION_LOCATION = `extensions/`,
  MIXIN_LOCATION = `mixins/`,
  MUTATOR_LOCATION = `mutators/`,
  TOOLBOX_LOCATION = `toolbox/`,
  WORKSPACE_LOCATION = `workspace/`,

  EXAMPLE_FILES = [ '**/*example*.js' ],
  NON_BLOCK_FILES = [
    '**/*extension*.js',
    '**/*mixin*.js',
    '**/*mutator*.js',
    '**/*shadow*.js'
  ].concat(EXAMPLE_FILES)

export const DefinitionLoader = {
  loadMutators: async (appLocation=APP_LOCATION) => {
    const jsfiles = await glob(`./${appLocation}/${MUTATOR_LOCATION}**/*.js`, { ignore: EXAMPLE_FILES })

    // loads app/mutators/mutator_name.js into object like:
    // { mutatorName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}`)).default
      ]))
    ))
  },

  loadMixins: async (appLocation=APP_LOCATION) => {
    const jsfiles = await glob(`./${appLocation}/${MIXIN_LOCATION}**/*.js`, { ignore: EXAMPLE_FILES })

    // loads app/mixins/mixin_name.js into object like:
    // { mixinName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}`)).default
      ]))
    ))
  },

  loadExtensions: async (appLocation=APP_LOCATION) => {
    const jsfiles = await glob(`./${appLocation}/${EXTENSION_LOCATION}**/*.js`, { ignore: EXAMPLE_FILES })

    // loads app/extensions/extension_name.js into object like:
    // { extensionName: Function }
    return fromPairs(await Promise.all(
      jsfiles.map( async filePath => ([
        camelCase(filePath.split('/').at(-1).slice(0, -3)),
        (await import(`${PROJECT_ROOT}/${filePath}`)).default
      ]))
    ))
  },

  loadBlocks: async (appLocation=APP_LOCATION) => {
    // get the file listing
    const jsfiles = await glob(`${appLocation}/${BLOCK_LOCATION}**/*.js`, { ignore: NON_BLOCK_FILES })
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

  loadToolboxes: async (appLocation=APP_LOCATION) => {
    // hardcode to a single toolbox for now
    const rawToolboxDef = (await import(`${PROJECT_ROOT}/${appLocation}/${TOOLBOX_LOCATION}index.js`)).default
    return [ rawToolboxDef ]
  },

  loadWorkspaces: async (appLocation=APP_LOCATION) => {
    // hardcode to a single workspace for now
    const rawWorkspaceDef = (await import(`${PROJECT_ROOT}/${appLocation}/${WORKSPACE_LOCATION}workspace.json`, { with: { type: 'json' }})).default
    return [ rawWorkspaceDef ]
  },

  loadAll: async (givenOptions = {}) => {
    const options = {
      source: APP_LOCATION,
      ...givenOptions
    }

    return {
      mutators: await DefinitionLoader.loadMutators(options.source),
      mixins: await DefinitionLoader.loadMixins(options.source),
      extensions: await DefinitionLoader.loadExtensions(options.source),
      blocks: await DefinitionLoader.loadBlocks(options.source),
      toolboxes: await DefinitionLoader.loadToolboxes(options.source),
      workspaces: await DefinitionLoader.loadWorkspaces(options.source),
    }
  }
}

export default DefinitionLoader
