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
        "name": "FEED"
      },
      {
        "type": "input_value",
        "name": "VALUE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 345,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for action_publish_to_feed.js"'
    },

    markdown: (block, generator) => {
      return '# action_publish_to_feed.js'
    }
  }
}
