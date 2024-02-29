export default {
  type: 'logic_negate',

  toolbox: {
    category: 'Logic',
  },

  generators: {
    json: (block, generator) => {
      const
        operand = generator.valueToCode(block, 'BOOL', 0) || 'null',
        blockPayload = {
          negate: JSON.parse(operand)
        }

      return [ JSON.stringify(blockPayload), 0 ]
    }
  }
}
