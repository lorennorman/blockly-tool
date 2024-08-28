export default {
  type: 'matcher_compare',

  toolbox: {
    category: 'Matchers',
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
    ["", { inputValue: 'B', shadow: 'io_math_number' }]
  ],

  generators: {
    json: (block, generator) => {
      const
        comparator = block.getFieldValue('OP'),
        rightExp = generator.valueToCode(block, 'B', 0) || 'null',

        blockPayload = JSON.stringify({
          compare: {
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
          B: helpers.expressionToBlock(right, { shadow: 'io_math_number' }),
        }

      return { type: 'matcher_compare', fields, inputs }
    }
  }
}
