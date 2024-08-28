export default {
  type: "when_data_matching",

  toolbox: {
    category: 'Triggers'
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
    [ "...when %FEED_KEY", {
      align: "LEFT",
      field: 'FEED_KEY',
      options: [
        // TODO: share feed list extension
        ["Temp: F", "temp-f"],
      ]
    }],

    [ "gets data matching %CONDITION", {
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
        type: "when_data_matching",
        fields: {
          FEED_KEY: payload.key
        }
      }
    }
  }
}
