export default {
  disabled: true,

  type: 'text_regex',

  toolbox: {
    category: 'Text',
  },

  visualization: {
    colour: 180,
    tooltip: [
      "Check for a regex match",
      "-",
      "Inputs:",
      "---------------",
      // "Text A - the first string of text",
      // "Text B - the second string of text",
      "-",
      "Casting:",
      "---------------",
      "-",
      "Options:",
      "---------------",
    ].join('\n'),
  },

  lines: [
    ["Regex:", { inputValue: 'REGEX', shadow: "io_text" }],
    ["Matches?", { inputValue: 'TARGET', shadow: "io_text" }]
  ],

  generators: {
    json: (block, generator) => {
      const
        regexExp = generator.valueToCode(block, 'REGEX', 0) || null,
        targetExp = generator.valueToCode(block, 'TARGET', 0) || null,

        blockPayload = JSON.stringify({
          textRegex: {
            regex: JSON.parse(regexExp),
            target: JSON.parse(targetExp),
          },
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { regex, target } = blockObject.textRegex,
        inputs = {
          REGEX: helpers.expressionToBlock(regex, { shadow: "io_text" }),
          TARGET: helpers.expressionToBlock(target, { shadow: "io_text" }),
        }

      return { type: 'text_regex', inputs }
    }
  }
}
