import processConnections from './connections.js'
import processLines from './lines.js'
import processExtensions from './extensions.js'
import processMutator from './mutators.js'

export const toBlockJSON = block => ({
  inputsInline: block.inputsInline,
  type: block.type,
  colour: block.colour,
  tooltip: block.tooltip,
  ...block.visualization,
  ...processConnections(block),
  ...processLines(block),
  ...processExtensions(block),
  ...processMutator(block),
})
