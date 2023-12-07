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
        "name": "FEED_KEY",
        "options": [
          [
            "🤖 Thermostat",
            "device:thermostat-feed"
          ],
          [
            "🌡️ Room Temp C° (funhouse)",
            "funhouse123456:ws-001"
          ],
          [
            "more options...",
            "OPTIONNAME"
          ]
        ]
      }
    ],
    "output": "feed",
    "colour": 30,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      const feedKey = block.getFieldValue('FEED_KEY')
      return [`{ "feedKey": "${feedKey}" }`, 0]
    },

    markdown: (block, generator) => {
      return '# feed_selector.js'
    }
  }
}
