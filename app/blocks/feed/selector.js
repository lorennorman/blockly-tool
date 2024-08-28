export default {
  type: "feed_selector",

  toolbox: {
    category: 'Feeds'
  },

  visualization: {
    colour: 300,
    tooltip: "The last value of this feed or component, always a String"
  },

  extensions: ['populateFeedDropdown'],

  lines: [
    [ "Feed:", {
      field: "FEED_KEY",
      options: [
        [ "Loading Feeds...", "" ],
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
        type: "feed_selector",
        fields: {
          FEED_KEY: payload.key
        }
      }
    }
  }
}
