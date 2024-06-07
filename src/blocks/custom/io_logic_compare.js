export default {
  type: 'io_logic_compare',

  toolbox: {
    category: 'Logic',
  },

  visualization: {
    inputsInline: true,
    colour: 60,
    tooltip: "Compare two values."
  },

  lines: [
    ["", { inputValue: 'A', shadow: 'math_number' }],
    [ "", {
      field: "OP",
      options: [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
        ['\u200F<', 'LT'],
        ['\u200F\u2264', 'LTE'],
        ['\u200F>', 'GT'],
        ['\u200F\u2265', 'GTE'],
      ]
    }],
    ["", { inputValue: 'B', shadow: 'math_number' }]
  ],

  generators: {
    json: (block, generator) => {
      const
        comparator = block.getFieldValue('OP'),
        leftExp = generator.valueToCode(block, 'A', 0) || 'null',
        rightExp = generator.valueToCode(block, 'B', 0) || 'null',

        blockPayload = JSON.stringify({
          compare: {
            left: JSON.parse(leftExp),
            comparator: comparator?.toLowerCase() || null,
            right: JSON.parse(rightExp),
          },
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { comparator, left, right } = blockObject.compare,
        fields = {
          OP: comparator?.toUpperCase()
        },
        inputs = {
          A: helpers.expressionToBlock(left, { shadow: 'math_number' }),
          B: helpers.expressionToBlock(right, { shadow: 'math_number' }),
        }

      return { type: 'io_logic_compare', fields, inputs }
    }
  }
}
