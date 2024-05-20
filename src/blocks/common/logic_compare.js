export default {
  type: 'logic_compare',

  toolbox: {
    category: 'Logic',
  },

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
          A: helpers.expressionToBlock(payload.left),
          B: helpers.expressionToBlock(payload.right),
        }

      return { type: 'logic_compare', fields, inputs }
    }
  }
}
