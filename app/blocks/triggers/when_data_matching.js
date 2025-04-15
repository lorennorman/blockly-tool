export default {
  type: "when_data_matching",

  toolbox: {
    category: 'Triggers',
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: [
      "Run this Action when the specified Feed receives data that matches the specified condition.",
      "-",
      "Inputs:",
      "---------------",
      "Feed - the Feed to watch for new data points",
      "Matcher - a numerical or textual matcher block to try new Feed data points with",
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

    [ "gets data matching: %MATCHER", {
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
        matcher = JSON.parse(generator.valueToCode(block, 'MATCHER', 0) || null),
        payload = JSON.stringify({
          whenDataMatching: {
            feed, matcher
          }
        })

      return payload
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.whenDataMatching

      return {
        type: "when_data_matching",
        fields: {
          FEED_KEY: payload.feed
        },
        inputs: {
          MATCHER: helpers.expressionToBlock(payload.matcher)
        }
      }
    }
  }
}
