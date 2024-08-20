export default {
  type: 'io_text_join',

  toolbox: {
    category: 'Text',
  },

  visualization: {
    inputsInline: true,
    colour: 180,
    tooltip: [
      "Join two chunks of text into one.",
      "-",
      "Inputs:",
      "---------------",
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
    ["+", ""],
    ["", { inputValue: 'B', shadow: "io_text" }]
  ],

  generators: {
    json: (block, generator) => {
      const
        leftExp = generator.valueToCode(block, 'A', 0) || null,
        rightExp = generator.valueToCode(block, 'B', 0) || null,

        blockPayload = JSON.stringify({
          textJoin: {
            left: JSON.parse(leftExp),
            right: JSON.parse(rightExp),
          },
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { left, right } = blockObject.textJoin,
        inputs = {
          A: helpers.expressionToBlock(left, { shadow: "io_text" }),
          B: helpers.expressionToBlock(right, { shadow: "io_text" }),
        }

      return { type: 'io_text_join', inputs }
    }
  }
}
