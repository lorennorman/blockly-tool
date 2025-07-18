import processConnections from './connections.js'
import processTemplate from './template.js'
import processExtensions from './extensions.js'
import processMutator from './mutators.js'

export const toBlockJSON = block => ({
  inputsInline: block.inputsInline,
  type: block.type,
  colour: block.colour || block.color,
  tooltip: block.tooltip,
  ...block.visualization,
  ...processConnections(block),
  ...processTemplate(block),
  ...processExtensions(block),
  ...processMutator(block),
})
