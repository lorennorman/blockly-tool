export default {
  type: 'matcher_text_compare',

  toolbox: {
    category: 'Matchers',
  },

  visualization: {
    inputsInline: true,
    colour: 180,
    tooltip: [
      "Compare the new feed value with text for equality or inequality.",
      "-",
      "Inputs:",
      "---------------",
      "Comparator - check for equality or inequality?",
      "Text B - the string of text to compare against the feed value",
      "-",
      "Casting:",
      "---------------",
      "Both the Feed value and Text B input are coerced to strings",
    ].join('\n'),
  },

  connections: { mode: 'value', output: 'matcher' },

  lines: [
    [ "", {
      field: "OP",
      options: [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
      ]
    }],
    ["", { inputValue: 'B', shadow: "io_text" }]
  ],

  generators: {
    json: (block, generator) => {
      const
        comparator = block.getFieldValue('OP'),
        rightExp = generator.valueToCode(block, 'B', 0) || null,

        blockPayload = JSON.stringify({
          matcherTextCompare: {
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
        { comparator, right } = blockObject.matcherTextCompare,
        fields = {
          OP: comparator?.toUpperCase()
        },
        inputs = {
          B: helpers.expressionToBlock(right, { shadow: "io_text" }),
        }

      return { type: 'matcher_text_compare', fields, inputs }
    }
  }
}
