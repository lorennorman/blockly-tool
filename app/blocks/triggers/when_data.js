export default {
  type: "when_data",

  toolbox: {
    category: 'Triggers',
    label: 'Runs the Action when a Feed gets ANY data.'
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: "Run this action when a feed receives data."
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  mixins: ['replaceDropdownOptions'],
  extensions: ['populateFeedDropdown'],

  lines: [
    [ "...when %FEED_KEY gets data", {
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
