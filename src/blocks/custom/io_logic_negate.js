export default {
  type: 'io_logic_negate',

  toolbox: {
    category: 'Logic',
  },

  visualization: {
    colour: 60,
  },

  lines: [
    ["not", { inputValue: 'BOOL', shadow: 'logic_boolean' }]
  ],

  generators: {
    json: (block, generator) => {
      const
        operand = generator.valueToCode(block, 'BOOL', 0) || null,
        blockPayload = {
          negate: JSON.parse(operand)
        }

      return [ JSON.stringify(blockPayload), 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.negate

      return {
        type: 'io_logic_negate',
        inputs: {
          BOOL: helpers.expressionToBlock(payload, { shadow: 'logic_boolean' })
        }
      }
    }
  }
}
