export default {
  type: 'io_logic_compare',

  toolbox: {
    category: 'Logic',
  },

  visualization: {
    inputsInline: true,
    colour: 240,
    tooltip: "Compare two values."
  },

  connections: {
    mode: "value",
    // output: "feed"
    output: null
  },

  lines: [
    ["", { inputValue: 'A' }],
    [ "", {
      field: "OP",
      options: [
        [ ">", "1001" ],
        [ "<", "1002" ],
        [ "=", "1003" ],
      ]
    }],
    ["", { inputValue: 'B' }]
  ],

  generators: {
    json: (block, generator) => {
      const
        comparator = block.getFieldValue('OP'),
        leftExp = generator.valueToCode(block, 'A', 0) || 'null',
        rightExp = generator.valueToCode(block, 'B', 0) || 'null',

        blockPayload = JSON.stringify({
          compare: {
            left: JSON.parse(leftExp),
            comparator: comparator?.toLowerCase() || null,
            right: JSON.parse(rightExp),
          },
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        payload = blockObject.compare,
        fields = {
          OP: payload.comparator?.toUpperCase()
        },
        inputs = {
          A: helpers.expressionToBlock(payload.left, { shadow: 'logic_boolean' }),
          B: helpers.expressionToBlock(payload.right, { shadow: 'logic_boolean' }),
        }

      return { type: 'io_logic_compare', fields, inputs }
    }
  }
}
