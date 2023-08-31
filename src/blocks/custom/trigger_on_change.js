
export default {
  toolbox: {
    category: 'Triggers'
  },

  json: {
    type: "trigger_on_change",
    message0: "Feed Check: %1 Reactive? %2",
    args0: [
      {
        type: "input_value",
        name: "FEED_CHECK"
      },
      {
        type: "field_checkbox",
        name: "REACTIVE",
        checked: true
      }
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: "Plug in a Feed, or Logic that references a Feed.",
    helpUrl: ""
  },

  generators: {
    json: (block, generator) => {
      const
        feedToCheck = generator.valueToCode(block, 'FEED_CHECK', 0),
        isReactive = block.getFieldValue('REACTIVE') === 'TRUE',

        lines = [
          `"trigger": "feed_check",`,
          `"feedKey": "${feedToCheck}",`,
          `"reactive": ${isReactive}`,
        ],

        indentedLines = generator.prefixLines(lines.join('\n'), generator.INDENT)

      return `{\n${ indentedLines }\n}`
    },

    markdown: (block, generator) => {
      return 'markity'
    }
  }
}
