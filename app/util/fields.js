import { filter, map, range } from 'lodash-es'


const makeFactorsOf = target => {
  return map(map(filter(range(target), idx => (target % idx) == 0), String), idx => ([ idx, idx ]))
}

const makeFactorsUpTo = target => {
  return map(map(range(target), String), idx => ([ idx, idx ]))
}

/**
*
* @param {Object} options
* @param {number} [options.factorsOf]
* @param {number} [options.upTo]
* @returns {Array}
*/
export const makeOptions = (options = {}) => {
  if(options.factorsOf) {
    return makeFactorsOf(options.factorsOf)
  }

  if(options.upTo) {
    return makeFactorsUpTo(options.upTo)
  }

  throw new Error(`No valid options sent to makeOptions: ${options}`)
}
