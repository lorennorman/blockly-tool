export default {
  type: "when_data_matching",

  toolbox: {
    category: 'Triggers',
    label: 'Runs the Action when a Feed gets data that passes the Matcher.'
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: "Run this action when a feed receives data."
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  extensions: [ "populateFeedDropdown" ],

  lines: [
    [ "...when %FEED_KEY", {
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
