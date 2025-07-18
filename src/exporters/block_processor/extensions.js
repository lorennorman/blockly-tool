import { isArray, isString, keys, flatMap } from 'lodash-es'

// input -> output
// [ 'string1', 'string2' ]       ->  [ 'string1', 'string2' ]
// { key1: {...}, key2: {...} }   ->  [ 'key1',    'key2' ]
// [ 'string1', { key2: {...} } ] ->  [ 'string1', 'key2' ]
const stringsOrKeys = object => {
  if(!object) { return [] }

  if(isArray(object)) {
    return flatMap(object, item => {
      return isString(item) ? item : keys(item)
    })
  } else {
    return Object.keys(object)
  }
}

export default block => {
  const
    definitionExtensions = block?.extensions,
    definitionMixins = block?.mixins,
    extensions = [
      // add mixins first, allows extensions to use them
      ...stringsOrKeys(definitionMixins),
      ...stringsOrKeys(definitionExtensions)
    ]

  return extensions.length ? { extensions } : {}
}
