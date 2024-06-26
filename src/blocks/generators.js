import Blockly from 'blockly'

/* LOCAL->> */
import { map } from 'lodash-es'
import { allBlockGenerators as blockGenerators } from './index.js'

export const renderedBlockGenerators = `
const blockGenerators = {${map(blockGenerators, (generators, blockName) => `
  ${blockName}: {${map(generators, (func, name) => `
    ${name}: ${func}`).join(',\n')}
  }`).join(',\n')}
}
`
/* <<-LOCAL */

const SCRUB_FUNCTIONS = generator => ({
  json: (block, previousJSON, thisOnly) => {
    const nextBlock = block.nextConnection?.targetBlock()

    return (nextBlock && !thisOnly)
      ? `${ previousJSON },\n${ generator.blockToCode(nextBlock) }`
      : previousJSON
  }
})

const makeGenerator = generatorType => {
  const
    generator = new Blockly.Generator(generatorType),
    scrubFunction = SCRUB_FUNCTIONS(generator)[generatorType],
    generatorsOfType = Object.keys(blockGenerators).reduce((acc, blockName) => {
      acc[blockName] = blockGenerators[blockName][generatorType]
      return acc
    }, {})

  if(scrubFunction) { generator.scrub_ = scrubFunction }

  for (const [blockName, blockGenerator] of Object.entries(generatorsOfType)) {
    if(!blockGenerator) {
      console.warn(`Block ${blockName} doesn't have a "${generatorType}" generator`)
      return
    }

    generator.forBlock[blockName] = blockGenerator
  }

  return generator
}

export default {
  json: makeGenerator('json')
}
