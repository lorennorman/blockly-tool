export default {
  type: "action_publish",

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
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "📈 Publish", "CENTER" ],

    [ "...value:", {
      inputValue: "VALUE",
      // check: [ "String", "Number" ],
      shadow: 'text'
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

      return {
        type: "action_publish",
        inputs: {
          FEED: helpers.expressionToBlock(payload.feed),
          VALUE: helpers.expressionToBlock(payload.value),
        }
      }
    }
  }
}
