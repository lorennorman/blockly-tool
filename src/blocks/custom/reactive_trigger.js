
export default {
  toolbox: {
    category: 'Triggers'
  },

  json: {
    "type": "reactive_trigger",
    "implicitAlign0": "RIGHT",
    "message0": "Reactive Trigger %1 Compare Feeds: %2 Feed %3 Operator %4 Feed or Number %5 Limit Every %6 %7 %8 %9 Notify on Reset",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "FEED_A",
        "check": "feed",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "COMPARATOR",
        "check": "comparison_operator",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "FEED_B",
        "check": [
          "feed",
          "Number"
        ],
        "align": "RIGHT"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "LIMIT_EVERY",
        "options": [
          [
            "10 seconds",
            "10"
          ],
          [
            "1 day",
            "10000"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_checkbox",
        "name": "NAME",
        "checked": true
      }
    ],
    "inputsInline": false,
    "output": "trigger",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      const
        feedToCheck = generator.valueToCode(block, 'FEED_CHECK', 0),
        isReactive = block.getFieldValue('REACTIVE') === 'TRUE',

        lines = [
          `"trigger": "feed_check",`,
          `"check": ${feedToCheck},`,
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
