import { glob } from 'glob'
import { compact, keyBy, keys, map, omitBy, sortBy, without } from 'lodash-es'

import { toBlockJSON } from './block_processor/index.js'


// server-side
// gathers all block definition files in /app/blocks
// passes each definition and its path through block processor
// returns a collection of the resulting json

// files
const
  PROJECT_ROOT = process.cwd(),
  BLOCK_LOCATION = `app/blocks/`,
  NON_BLOCK_FILES = [
    '**/*extension*.js',
    '**/*mixin*.js',
    '**/*mutator*.js',
    '**/*shadow*.js',
    '**/*example*.js',
  ],

  gatherBlockFiles = async () => {
    const
      jsfiles = await glob(`./${BLOCK_LOCATION}**/*.js`, { ignore: NON_BLOCK_FILES }),
      random = Math.random()*100000000 // break the import cache

    return Promise.all(
      jsfiles.map(
        async filePath => ({
          definition: (await import(`${PROJECT_ROOT}/${filePath}?key=${random}`)).default,
          path: filePath.slice(BLOCK_LOCATION.length)
        })
      )
    )
  }

// definitions
const
  BLOCK_KEYS = [
    "type",
    "name",
    "primaryCategory",
    "color",
    "bytecodeKey",
    "inputs",
    "fields",
    "template",
    "description",
    "disabled",
    "generators",
    "regenerators",
    "toolbox",
    "visualization",
    "mixins",
    "extensions",
    "mutator",
    "connections",
    "lines"
  ],

  processBlock = ({ definition, path }) => {
    if(!definition) {
      throw new Error(`No Block definition found at path: ${BLOCK_LOCATION}${path}`)
    }

    // ensure only supported keys are present
    const extraKeys = without(keys(definition), ...BLOCK_KEYS)

    if(extraKeys.length) {
      throw new Error(`Custom Block definition has unrecognized keys: "${extraKeys.join('", "')}"\nBlock: ${definition.type} @ ${path}`)
    }

    if(definition.disabled) { return }

    // TODO: mechanism for Definition JSON defaults
    if(definition.connections?.mode === 'value') {
      // default input values with no output to 'expression'
      definition.connections.output = definition.connections.output || 'expression'
    }

    // TODO: mechanism for Blockly JSON defaults
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
    sortBy(compact(map(await gatherBlockFiles(), processBlock)), "type"),

  // defs and paths
  allBlockDefinitionsAndPaths = await gatherBlockFiles(),
  // just the definitions
  allBlockDefinitions = keyBy(compact(map(allBlockDefinitionsAndPaths, "definition")), "type"),
  // without disabled definitions
  blockDefinitions = omitBy(allBlockDefinitions, def => def.disabled),
  blockJson = compact(map(allBlockDefinitionsAndPaths, processBlock))

export default blockJson
