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

  extensions: [ "populateFeedDropdown" ],

  lines: [
    [ "...when %FEED_KEY", {
      align: "LEFT",
      field: 'FEED_KEY',
      options: [
        [ "Loading Feeds...", ""]
      ]
    }],

    [ "gets data matching %CONDITION", {
      inputValue: "CONDITION",
      shadow: {
        type: 'matcher_compare',
        inputs: {
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
