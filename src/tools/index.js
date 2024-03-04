
import processConnections from './connections.js'
import processLines from './lines.js'

export const toBlockJSON = block => ({
  type: block.type,
  ...block.visualization,
  ...processConnections(block),
  ...processLines(block),
  ...processExtensions(block)
})

const processExtensions = block => ({})
