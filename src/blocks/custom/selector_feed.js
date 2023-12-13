export default {
  toolbox: {
    category: 'Feeds',
  },

  json: {
    "type": "selector_feed",
    "message0": "Feed: %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FEED_ID",
        "options": [
          [ "Feed_A", "1001" ],
          [ "Feed_B", "1002" ],
          [ "Feed_C", "1003" ],
        ]
      }
    ],
    "extensions": [ "populate_feeds_dropdown" ],
    "output": "feed",
    "colour": 30,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: block => [ block.getFieldValue('FEED_ID'), 0 ],

    markdown: (block, generator) => {
      return '# selector_feed.js'
    }
  }
}
