export default {
  toolbox: {
    category: 'Actions',
  },

  json: {
    "type": "action_publish_to_feed",
    "message0": "Publish to Feed %1 Feed: %2 Value: %3",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "FEED",
        "check": "feed",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": [
          "Boolean",
          "String",
          "Number"
        ],
        "align": "RIGHT"
      }
    ],
    "output": "action",
    "colour": 345,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      const
        feed = generator.valueToCode(block, 'FEED', 0) || 'null',
        value = generator.valueToCode(block, 'VALUE', 0) || 'null',

        lines = [
          `"action": "publish_to_feed"`,
          `"feed": ${feed}`,
          `"value": ${value}`
        ],

        indentedLines = generator.prefixLines(lines.join(',\n'), generator.INDENT)

      return `{\n${indentedLines}\n}`
    },

    markdown: (block, generator) => {
      return '# action_publish_to_feed.js'
    }
  }
}
