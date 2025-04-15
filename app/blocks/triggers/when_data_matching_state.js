export default {
  type: "when_data_matching_state",

  toolbox: {
    category: 'Triggers',
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: [
      "Run this Action when the specified Feed receives a data point that compares to its previous data point in the specified way.",
      "-",
      "Inputs:",
      "---------------",
      "Feed - the Feed to watch for new data points",
      "Match State - the kind of change to watch for:",
      "- \"starts\" - the last data point DID NOT match, but this one DOES",
      "- \"stops\" - the last data point DID match, but this one DOES NOT",
      "- \"keeps\" - both data points DO match",
      "- \"keeps not\" - both data points DO NOT match",
      "Matcher - a numerical or textual matcher block to use on both data points before making the above comparison",
    ].join('\n'),
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  mixins: ['replaceDropdownOptions'],
  extensions: [ "populateFeedDropdown" ],

  lines: [
    [ "When %FEED_KEY", {
      align: "LEFT",
      field: 'FEED_KEY',
      options: [
        [ "Loading Feeds...", ""]
      ]
    }],

    [ "gets data that %MATCH_STATE", {
      field: 'MATCH_STATE',
      options: [
        ["starts", "starts"],
        ["stops", "stops"],
        ["keeps", "keeps"],
        ["keeps not", "avoids"],
      ]
    }],

    [ "matching %MATCHER", {
      inputValue: "MATCHER",
      check: 'matcher',
      shadow: {
        type: 'matcher_compare',
        inputs: {
          B: { shadow: { type: 'io_math_number' } },
        }
      }
    }],
  ],

  generators: {
    json: (block, generator) => {
      const
        feed = block.getFieldValue('FEED_KEY'),
        state = block.getFieldValue('MATCH_STATE'),
        matcher = JSON.parse(generator.valueToCode(block, 'MATCHER', 0) || null),
        payload = JSON.stringify({
          whenDataMatchStateChanged: {
            feed, matcher, state
          }
        })

      return payload
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { feed, matcher, state } = blockObject.whenDataMatchStateChanged

      return {
        type: "when_data_matching_state",
        fields: {
          FEED_KEY: feed,
          MATCH_STATE: state,
        },
        inputs: {
          MATCHER: helpers.expressionToBlock(matcher)
        }
      }
    }
  }
}
