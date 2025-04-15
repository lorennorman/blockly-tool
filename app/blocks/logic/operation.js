export default {
  type: 'io_logic_operation',

  toolbox: {
    category: 'Logic',
  },

  visualization: {
    inputsInline: true,
    colour: 60,
    tooltip: [
      "Perform the specifed boolean logic operation on two operands.",
      "-",
      "Inputs:",
      "---------------",
      "Operator - the type of operation to perform, \"and\" or \"or\"",
      "\"and\" - true if all inputs are true, false otherwise",
      "\"or\" - true if any input is true, false otherwise",
      "Boolean A - the first boolean",
      "Boolean B - the second boolean",
      "-",
      "Casting:",
      "---------------",
      "both inputs are coerced to true or false before the operation",
    ].join('\n'),
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
