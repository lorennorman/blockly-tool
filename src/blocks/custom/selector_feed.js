export default {
  type: "selector_feed",

  toolbox: {
    category: 'Feeds',
  },

  visualization: {
    colour: 30,
    // TODO: proper extension handling
    extensions: [ "populate_feeds_dropdown" ],
  },

  connections: {
    mode: "value",
    output: "feed"
  },

  lines: [
    [ "Feed:", {
      field: "FEED_ID",
      options: [
        [ "Feed_A", "1001" ],
        [ "Feed_B", "1002" ],
        [ "Feed_C", "1003" ],
      ]
    }],
  ],

  generators: {
    json: block => [ block.getFieldValue('FEED_ID'), 0 ]
  }
}
