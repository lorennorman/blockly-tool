export default {
  type: "feed_set_value",

  toolbox: {
    label: "Publish a new value to a Feed"
  },

  visualization: {
    inputsInline: true,
    colour: 300
  },

  mixins: ['replaceDropdownOptions'],
  extensions: ['populateFeedDropdown'],

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "Set %FEED_KEY to:", {
      field: "FEED_KEY",
      options: [
        [ "Loading Feeds...", "" ],
      ]
    }],

    ["%VALUE", {
      inputValue: "VALUE",
      shadow: 'io_text'
    }],
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        setFeedValue: {
          key: block.getFieldValue('FEED_KEY'),
          value: JSON.parse(generator.valueToCode(block, 'VALUE', 0))
        }
      }

      return JSON.stringify(payload)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.setFeedValue

      return {
        type: "feed_set_value",
        fields: {
          FEED_KEY: payload.key,
        },
        inputs: {
          VALUE: helpers.expressionToBlock(payload.value, { shadow: 'io_text' }),
        }
      }
    }
  }
}
