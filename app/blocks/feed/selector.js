// deprecated: use feeds/get_value
export default {
  type: "feed_selector",

  visualization: {
    colour: 300,
    tooltip: "The last value of this feed or component, always a String"
  },

  mixins: ['replaceDropdownOptions'],
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

      // migrating to a new block
      return {
        type: "feed_get_value",
        fields: {
          FEED_KEY: payload.key
        }
      }
    }
  }
}
