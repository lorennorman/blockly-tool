export default {
  type: "when_data",

  toolbox: {
    category: 'Triggers',
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: [
      "Run this action when a Feed receives a new data point.",
      "-",
      "Inputs:",
      "---------------",
      "Feed - the Feed to watch for new data points",
    ].join("\n")
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  mixins: ['replaceDropdownOptions'],
  extensions: ['populateFeedDropdown'],

  lines: [
    [ "When %FEED_KEY gets any data", {
      align: 'LEFT',
      field: "FEED_KEY",
      options: [
        [ "Loading Feeds...", ""]
      ]
    }],
  ],

  generators: {
    json: block => {
      const
        feed = block.getFieldValue('FEED_KEY'),
        payload = JSON.stringify({
          whenData: { feed }
        })

      return payload
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.whenData

      return {
        type: "when_data",
        fields: {
          FEED_KEY: payload.feed
        }
      }
    }
  }
}
