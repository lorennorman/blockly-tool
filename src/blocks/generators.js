import Blockly from 'blockly'

import allBlocks from './all.js'

const SCRUB_FUNCTIONS = {
  json: (block, previousJSON, thisOnly) => {
    const nextBlock = block.nextConnection?.targetBlock()

    return (nextBlock && !thisOnly)
      ? `${ previousJSON },\n${ generator.blockToCode(nextBlock) }`
      : previousJSON
  }
}

const makeGenerator = generatorType => {
  const
    generator = new Blockly.Generator(generatorType),
    scrubFunction = SCRUB_FUNCTIONS[generatorType]

  if(scrubFunction) { generator.scrub_ = scrubFunction }

  for (const blockName in allBlocks) {
    const block = allBlocks[blockName]
    const blockGenerator = block.generators[generatorType]
    if(blockGenerator) {
      generator.forBlock[blockName] = blockGenerator
    }
  }

  return generator
}

export default {
  json: makeGenerator('json')
}
