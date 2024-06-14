export default {
  type: 'io_logic_compare',

  toolbox: {
    category: 'Math',
  },

  visualization: {
    inputsInline: true,
    colour: 224,
    tooltip: [
      "Compare two numeric values in various ways.",
      "-",
      "Inputs:",
      "---------------",
      "Comparator - check equality, inequality, greater than, greater than or equal to, less than, less than or equal to?",
      "Number A - the first number",
      "Number B - the second number",
      "-",
      "Casting:",
      "---------------",
      "both inputs are coerced to floating point numbers",
    ].join('\n'),
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
