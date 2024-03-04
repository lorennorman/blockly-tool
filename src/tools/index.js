import processConnections from './connections.js'
import processLines from './lines.js'
import processExtensions from './extensions.js'

export const toBlockJSON = block => ({
  type: block.type,
  ...block.visualization,
  ...processConnections(block),
  ...processLines(block),
  ...processExtensions(block)
})
