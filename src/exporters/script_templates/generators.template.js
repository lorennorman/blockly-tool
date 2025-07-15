/* LOCAL->> */
const blockGenerators = {}
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

export const generators = {
  json: makeGenerator('json')
}
