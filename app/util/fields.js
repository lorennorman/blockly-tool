import { filter, map, range } from 'lodash-es'


const makeFactorsOf = target => {
  return map(map(filter(range(target), idx => (target % idx) == 0), String), idx => ([ idx, idx ]))
}

export const makeOptions = (options = {}) => {
  if(options.factorsOf) {
    return makeFactorsOf(options.factorsOf)
  }

  throw new Error(`No valid options sent to makeOptions: ${options}`)
}
