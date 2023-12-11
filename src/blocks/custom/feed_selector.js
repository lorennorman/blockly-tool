export default {
  toolbox: {
    category: 'Feeds',
  },

  json: {
    "type": "feed_selector",
    "message0": "Feed: %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FEED_ID",
        "options": [
          [
            "Feed A",
            "1001"
          ],
          [
            "Feed B",
            "1002"
          ],
          [
            "Feed C",
            "1003"
          ],
        ]
      }
    ],
    "output": "feed",
    "colour": 30,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: block => [ block.getFieldValue('FEED_ID'), 0 ],

    markdown: (block, generator) => {
      return '# feed_selector.js'
    }
  }
}
