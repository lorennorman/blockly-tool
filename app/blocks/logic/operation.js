export default {
  type: 'io_logic_operation',

  toolbox: {
    category: 'Logic',
    label: "Apply boolean logic (and/or) to 2 values"
  },

  visualization: {
    inputsInline: true,
    colour: 60,
  },

  lines: [
    ["", { inputValue: 'A', shadow: 'io_logic_boolean' }],
    ["", {
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
        leftExp = generator.valueToCode(block, 'A', 0) || null,
        rightExp = generator.valueToCode(block, 'B', 0) || null,

        blockPayload = JSON.stringify({
          logic: {
            left: JSON.parse(leftExp),
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
        { comparator, left, right } = blockObject.logic,
        fields = {
          OP: comparator?.toUpperCase()
        },
        inputs = {
          A: helpers.expressionToBlock(left, { shadow: 'io_logic_boolean' }),
          B: helpers.expressionToBlock(right, { shadow: 'io_logic_boolean' }),
        }

      return { type: 'io_logic_operation', fields, inputs }
    }
  }
}
