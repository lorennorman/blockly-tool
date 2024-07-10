import { glob } from 'glob'
import { compact, keyBy, keys, map, omitBy, without } from 'lodash-es'

import { toBlockJSON } from '../tools/index.js'


// server-side
// gathers all block definition files in /app/blocks
// passes each definition and its path through block processor
// returns a collection of the resulting json

// files
const
  PROJECT_ROOT = process.cwd(),
  BLOCK_LOCATION = `app/blocks/`,
  gatherBlockFiles = async () => {
    const
      jsfiles = await glob(`./${BLOCK_LOCATION}**/*.js`, { ignore: [ '**/*mutator.js', '**/*example*.js' ] }),
      random = Math.random()*100000000 // break the import cache

    return Promise.all(
      jsfiles.map(
        async filePath => ({
          definition: (await import(`${PROJECT_ROOT}/${filePath}?key=${random}`)).default,
          path: filePath.slice(BLOCK_LOCATION.length)
        })
      )
    )
  },
  allBlockDefinitionsAndPaths = await gatherBlockFiles()

// definitions
const
  BLOCK_KEYS = [
    "type",
    "disabled",
    "generators",
    "regenerators",
    "toolbox",
    "visualization",
    "extensions",
    "mutator",
    "connections",
    "lines"
  ],

  processBlock = ({ definition, path }) => {
    // console.log("Processing Block:", path)//, definition)
    // ensure only supported keys are present
    const extraKeys = without(keys(definition), ...BLOCK_KEYS)

    if(extraKeys.length) {
      throw new Error(`Custom Block definition has unrecognized keys: "${extraKeys.join('", "')}"\nBlock: ${definition.type} @ ${path}`)
    }

    if(definition.disabled) { return }

    // TODO: locate block defaults
    const blockDefaults = {
      inputsInline: false
    }

    return {
      ...blockDefaults,
      ...toBlockJSON(definition)
    }
  }

export const
  importBlockDefinitions = async () =>
    omitBy(keyBy(map(await gatherBlockFiles(), "definition"), "type"), def => def.disabled),

  importBlockJson = async () =>
    compact(map(await gatherBlockFiles(), processBlock)),

  // all definitions
  allBlockDefinitions = keyBy(map(allBlockDefinitionsAndPaths, "definition"), "type"),
  // without disabled definitions
  blockDefinitions = omitBy(allBlockDefinitions, def => def.disabled),
  blockJson = compact(map(allBlockDefinitionsAndPaths, processBlock))

export default blockJson
