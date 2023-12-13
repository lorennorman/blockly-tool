export default {
  toolbox: {
    category: 'Actions',
  },

  json: {
    "type": "action_publish_to_feed",
    "message0": "Publish to Feed %1 Feed: %2 Value: %3",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "FEED",
        "check": "feed",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": [
          "Boolean",
          "String",
          "Number"
        ],
        "align": "RIGHT"
      }
    ],
    "output": "action",
    "colour": 345,
    "tooltip": "",
    "helpUrl": ""
  },

  inputs: {
    FEED: {
      shadow: {
        type: 'selector_feed'
      }
    },
    VALUE: {
      shadow: {
        type: 'text'
      }
    },
  },

  generators: {
    json: (block, generator) => {
      const
        payload = {
          action: 'feed',
          action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
          action_value: generator.valueToCode(block, 'VALUE', 0) || null,
        }

      return [ payload, 0 ]
    },

    markdown: (block, generator) => {
      return '# action_publish_to_feed.js'
    }
  }
}
