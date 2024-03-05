import { isArray } from 'lodash-es'

export default block => {
  const extensions = block?.extensions

  if(!extensions) { return {} }

  return {
    extensions: isArray(extensions)
      ? extensions
      : Object.keys(block.extensions)
  }
}
