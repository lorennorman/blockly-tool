export default {
  type: "feed_get_value",

  toolbox: {
    label: "Retrieve the Feed's last value before this action started"
  },

  visualization: {
    colour: 300,
    tooltip: "The last value of this feed or component, always a String"
  },

  mixins: ['replaceDropdownOptions'],
  extensions: ['populateFeedDropdown'],

  lines: [
    [ "Get %FEED_KEY Feed's last value", {
      field: "FEED_KEY",
      options: [
        [ "Loading Feeds...", "" ],
      ]
    }]
  ],

  generators: {
    json: block => {
      const
        key = block.getFieldValue('FEED_KEY'),
        payload = JSON.stringify({
          getFeedValue: { key }
        })

      return [ payload, 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.getFeedValue

      return {
        type: "feed_get_value",
        fields: {
          FEED_KEY: payload.key
        }
      }
    }
  }
}
