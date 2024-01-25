export default {
  type: "action_publish_to_feed",

  toolbox: {
    category: 'Actions',
    label: "Publish a given value to a given feed."
  },

  visualization: {
    colour: "0",
    tooltip: [
      "Sends a given VALUE to a given FEED.",
      "---------------",
      "Parameters:",
      "VALUE - the value to write",
      "FEED - the feed to write to",
    ].join('\n'),
  },

  connections: {
    mode: "value",
    output: "action",
  },

  lines: [
    [ "📈 Publish", "CENTER" ],

    [ "...value:", {
      inputValue: "VALUE",
      check: [ "String", "Number" ],
      shadow: 'text'
    }],

    [ "...to:", {
      inputValue: "FEED",
      check: "feed",
      shadow: 'selector_feed'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        payload = {
          action: 'feed',
          action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
          action_value: generator.valueToCode(block, 'VALUE', 0)?.toString() || null,
        }

      return [ payload, 0 ]
    }
  }
}
