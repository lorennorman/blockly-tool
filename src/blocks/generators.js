import Blockly from 'blockly'

import { allBlockDefinitions } from './index.js'


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
    scrubFunction = SCRUB_FUNCTIONS(generator)[generatorType]

  if(scrubFunction) { generator.scrub_ = scrubFunction }

  for (const blockName in allBlockDefinitions) {
    const block = allBlockDefinitions[blockName]
    const blockGenerator = block.generators[generatorType]
    if(blockGenerator) {
      generator.forBlock[blockName] = blockGenerator
    } else {
      console.warn(`Block ${block.type} doesn't have a "${generatorType}" generator`)
    }
  }

  return generator
}

export default {
  json: makeGenerator('json')
}
