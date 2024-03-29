export default {
  type: "feed_selector",

  toolbox: {
    category: 'Feeds'
  },

  visualization: {
    colour: 240,
    tooltip: "The last value of this feed or component, always a String"
  },

  extensions: {
    populateFeedDropdown: ({ block, data, Blockly }) => {
      const { feedOptions } = data

      if(!feedOptions) {
        console.error(`No feedOptions in extension data to populate dropdowns!`)
        return
      }

      const input = block.getInput('')
      input.removeField("FEED_ID")
      input.appendField(new Blockly.FieldDropdown(feedOptions), "FEED_ID")
    }
  },

  connections: {
    mode: "value",
    // output: "feed"
    output: null
  },

  lines: [
    [ "Feed:", {
      field: "FEED_ID",
      options: [
        [ "Feed_A", "1001" ],
        [ "Feed_B", "1002" ],
        [ "Feed_C", "1003" ],
      ]
    }],
  ],

  generators: {
    json: block => {
      const
        feedId = block.getFieldValue('FEED_ID'),
        blockPayload = JSON.stringify({
          feed: { id: parseInt(feedId, 10) }
        })

      return [ blockPayload, 0 ]
    }
  }
}
