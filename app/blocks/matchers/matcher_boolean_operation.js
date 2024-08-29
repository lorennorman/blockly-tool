export default {
  type: 'matcher_boolean_operation',

  toolbox: {
    category: 'Matchers',
  },

  visualization: {
    inputsInline: true,
    colour: 60,
  },

  connections: { mode: 'value', output: 'matcher' },

  lines: [
    ["is true", {
      field: 'OP',
      options: [
        ['and', 'AND'],
        ['or', 'OR'],
      ]
    }],
    ["", { inputValue: 'B', shadow: 'io_logic_boolean' }],
  ],

  generators: {
    json: (block, generator) => {
      const
        operator = block.getFieldValue('OP'),
        rightExp = generator.valueToCode(block, 'B', 0) || null,

        blockPayload = JSON.stringify({
          matcherBooleanOperation: {
            comparator: operator?.toLowerCase() || null,
            right: JSON.parse(rightExp),
          },
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { comparator, right } = blockObject.matcherBooleanOperation,
        fields = {
          OP: comparator?.toUpperCase()
        },
        inputs = {
          B: helpers.expressionToBlock(right, { shadow: 'io_logic_boolean' }),
        }

      return { type: 'matcher_boolean_operation', fields, inputs }
    }
  }
}
