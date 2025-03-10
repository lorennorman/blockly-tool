export default {
  type: "when_data_matching_state",

  toolbox: {
    category: 'Triggers',
    label: 'Runs the Action based on the desired change in Matcher state.'
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

  mixins: ['replaceDropdownOptions'],
  extensions: [ "populateFeedDropdown" ],

  lines: [
    [ "...when %FEED_KEY", {
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
