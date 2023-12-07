// regex considerations:
// - timeout
// - case-sensitivity
// - single vs multi-line
// - regex-escaping strings
// - match? true/false
// - matches: 0 or more
// - numbered matches
// - named matches

export default {
  toolbox: {
    category: 'Transformers',
  },

  json: {
    "type": "transform_regex",
    "message0": "Input: %1 Regex: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "MATCH_STRING",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "REGEX_STRING",
        "check": "String",
        "align": "RIGHT"
      }
    ],
    "output": null,
    "colour": 230,
    "tooltip": "Returns the first match, or an empty string if there's no match.",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      const
        matchString = generator.valueToCode(block, 'MATCH_STRING', 0),
        regexString = generator.valueToCode(block, 'REGEX_STRING', 0)

      return [`{ "transformer": "regex", "regex": ${regexString}, "input_string": ${matchString} }`, 0]
    },

    markdown: (block, generator) => {
      return '# transform_regex.js'
    }
  }
}
