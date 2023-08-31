export const
  toolbox = {
    category: 'Feeds',
  },

  json = {
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
    "output": null,
    "colour": 30,
    "tooltip": "",
    "helpUrl": ""
  },

  generators = {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for feed_selector.js"'
    },

    markdown: (block, generator) => {
      return '# feed_selector.js'
    }
  }
