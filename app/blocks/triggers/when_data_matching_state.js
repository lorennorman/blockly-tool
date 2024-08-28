export default {
  type: "when_data_matching_state",

  toolbox: {
    // TODO: can't implement until dispatcher tracks from -> to values
    // category: 'Triggers'
  },

  visualization: {
    // inputsInline: true,
    colour: 30,
    tooltip: "Run this action when a feed receives data."
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  lines: [
    [ "...when %FEED", {
      align: "LEFT",
      // inputValue: "FEED",
      // shadow: 'feed_selector',
      field: 'FEED',
      options: [
        ["Temp: F", "temp-f"],
        ["Feeder 1", "abc123"],
        ["A Feed Z", "qrstuv"],
        ["Feedinsky &", "oneforyou-oneforme"],
      ]
    }],

    [ "gets data that %MATCH_STATE", {
      field: 'MATCH_STATE',
      options: [
        ["starts", "starts"],
        ["stops", "stops"],
        ["keeps", "keeps"],
        ["keeps not", "keeps-not"],
      ]
    }],

    [ "matching %CONDITION", {
      inputValue: "CONDITION",
      shadow: {
        type: 'io_logic_compare',
        inputs: {
          // A: { shadow: { type: 'feed_selector' } },
          B: { shadow: { type: 'io_math_number' } },
        }
      }
    }],
  ],

  generators: {
    json: block => {
      const
        key = block.getFieldValue('FEED_KEY'),
        payload = JSON.stringify({
          feed: { key }
        })

      return [ payload, 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.feed

      return {
        type: "when_data_matching_state",
        fields: {
          FEED_KEY: payload.key
        }
      }
    }
  }
}
