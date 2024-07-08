import { glob } from 'glob'
import { keyBy, keys, without } from 'lodash-es'

import { toBlockJSON } from '../tools/index.js'


// server-side
// gathers all block definition files in /app/blocks
// passes each definition and its path through block processor
// returns a collection of the resulting json
// export default async () => {
//   const
//     blockDefinitions = await gatherBlockFiles(),
//     blockJson = blockDefinitions.map(processBlock)

//   return blockJson
// }

const
  PROJECT_ROOT = process.cwd(),
  BLOCK_LOCATION = `app/blocks/`

export const
  // gatherBlockFiles = async () => {
  //   return await glob(`./${BLOCK_LOCATION}**/*.js`, { ignore: [ '**/*mutator.js', '**/*example*.js' ] })
  // },

  importBlockDefinitions = async () => keyBy((await gatherBlockFiles()).map(({ definition }) => definition), 'type'),

  importBlockJson = async () => (await gatherBlockFiles()).map(processBlock)

export default importBlockJson

const gatherBlockFiles = async () => {
  // return await glob(`./${BLOCK_LOCATION}**/*.js`, { ignore: [ '**/*mutator.js', '**/*example*.js' ] })
  const jsfiles = await glob(`./${BLOCK_LOCATION}**/*.js`, { ignore: [ '**/*mutator.js', '**/*example*.js' ] })

  return Promise.all(
    jsfiles.map(
      async filePath => ({
        definition: (await import(`${PROJECT_ROOT}/${filePath}`)).default,
        path: filePath.slice(BLOCK_LOCATION.length)
      })
    )
  )
}

const
  COMMON_KEYS = [
    "type",
    "toolbox",
    "generators",
    "regenerators"
  ],

  CUSTOM_KEYS = COMMON_KEYS.concat([
    "toolbox",
    "visualization",
    "extensions",
    "mutator",
    "connections",
    "lines"
  ])

const processBlock = ({ definition, path }) => {
  // console.log("Processing Block:", path)//, definition)
  // ensure only supported keys are present
  const extraKeys = without(keys(definition), ...CUSTOM_KEYS)

  if(extraKeys.length) {
    throw new Error(`Custom Block definition has unrecognized keys: "${extraKeys.join('", "')}"\nBlock: ${definition.type} @ ${path}`)
  }

  // TODO: locate block defaults
  const blockDefaults = {
    inputsInline: false
  }

  return {
    ...blockDefaults,
    ...toBlockJSON(definition)
  }
}

// old way
// import { customBlocksJson } from './blocks/index.js'
// export default () => customBlocksJson
