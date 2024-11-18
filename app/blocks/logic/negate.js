export default {
  type: 'io_logic_negate',

  toolbox: {
    category: 'Logic',
    label: "Make true false, or false true"
  },

  visualization: {
    colour: 60,
    tooltip: "Negates a true or false value"
  },

  lines: [
    ["not", { inputValue: 'EXPRESSION', shadow: 'io_logic_boolean' }]
  ],

  generators: {
    json: (block, generator) => {
      const
        operand = generator.valueToCode(block, 'EXPRESSION', 0) || null,
        payload = {
          negate: {
            target: JSON.parse(operand)
          }
        }

      return [ JSON.stringify(payload), 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.negate

      return {
        type: 'io_logic_negate',
        inputs: {
          EXPRESSION: helpers.expressionToBlock(payload.target, { shadow: 'io_logic_boolean' })
        }
      }
    }
  }
}
