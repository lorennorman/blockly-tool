export default {
  type: "selector_feed",

  toolbox: {
    category: 'Values',
    label: "A Feed/Component or its value"
  },

  visualization: {
    colour: 240,
    // TODO: proper extension handling
    extensions: [ "populate_feeds_dropdown" ],
    tooltip: "The last value of this feed or component, always a String"
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
