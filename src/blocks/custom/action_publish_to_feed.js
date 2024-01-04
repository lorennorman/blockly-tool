export default {
  type: "action_publish_to_feed",

  toolbox: {
    category: 'Actions',
  },

  visualization: {
    colour: 345,
  },

  connections: {
    mode: "value",
    output: "action",
  },

  lines: [
    [ "Publish to Feed", "CENTER" ],

    [ "Feed:", {
      inputValue: "FEED",
      check: "feed",
      shadow: 'selector_feed'
    }],

    [ "Value:", {
      inputValue: "VALUE",
      check: [ "Boolean", "String", "Number" ],
      shadow: 'text'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        payload = {
          action: 'feed',
          action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
          action_value: generator.valueToCode(block, 'VALUE', 0) || null,
        }

      return [ payload, 0 ]
    }
  }
}
