export default {
  type: 'text_compare',

  toolbox: {
    category: 'Text',
  },

  visualization: {
    inputsInline: true,
    colour: 180,
    tooltip: [
      "Compare two chunks of text for equality, inequality, or inclusion.",
      "-",
      "Inputs:",
      "---------------",
      "Comparator - check for equality, inequality, or inclusion",
      "Text A - the first string of text",
      "Text B - the second string of text",
      "-",
      "Casting:",
      "---------------",
      "both inputs are coerced to strings",
    ].join('\n'),
  },

  lines: [
    ["", { inputValue: 'A', shadow: "io_text" }],
    [ "", {
      field: "OP",
      options: [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
        ['includes', 'INC'],
      ]
    }],
    ["", { inputValue: 'B', shadow: "io_text" }]
  ],

  generators: {
    json: (block, generator) => {
      const
        comparator = block.getFieldValue('OP'),
        leftExp = generator.valueToCode(block, 'A', 0) || null,
        rightExp = generator.valueToCode(block, 'B', 0) || null,

        blockPayload = JSON.stringify({
          textCompare: {
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
        { comparator, left, right } = blockObject.textCompare,
        fields = {
          OP: comparator?.toUpperCase()
        },
        inputs = {
          A: helpers.expressionToBlock(left, { shadow: "io_text" }),
          B: helpers.expressionToBlock(right, { shadow: "io_text" }),
        }

      return { type: 'text_compare', fields, inputs }
    }
  }
}
