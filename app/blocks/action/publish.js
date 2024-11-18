// deprecated: use feeds/set_value
export default {
  type: "action_publish",

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
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "📈 Publish", "CENTER" ],

    [ "...value:", {
      inputValue: "VALUE",
      // check: [ "String", "Number" ],
      shadow: 'io_text'
    }],

    [ "...to:", {
      inputValue: "FEED",
      // check: "feed",
      shadow: 'feed_selector'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        publishAction: {
          feed: JSON.parse(generator.valueToCode(block, 'FEED', 0)),
          value: JSON.parse(generator.valueToCode(block, 'VALUE', 0))
        }
      }

      return JSON.stringify(payload)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.publishAction

      // migrating to a new block
      return {
        type: "feed_set_value",
        fields: {
          FEED_KEY: payload.feed.feed.key,
        },
        inputs: {
          VALUE: helpers.expressionToBlock(payload.value, { shadow: 'io_text' }),
        }
      }
    }
  }
}
