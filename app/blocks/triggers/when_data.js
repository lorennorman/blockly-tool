export default {
  type: "when_data",

  toolbox: {
    category: 'Triggers'
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

  extensions: ['populateFeedDropdown'],

  lines: [
    [ "...when %FEED_KEY gets data", {
      align: 'LEFT',
      field: "FEED_KEY",
      options: [
        [ "Loading Feeds...", ""]
      ]
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
        type: "when_data",
        fields: {
          FEED_KEY: payload.key
        }
      }
    }
  }
}