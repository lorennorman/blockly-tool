export default {
  type: 'logic_compare',

  toolbox: {
    category: 'Logic',
  },

  generators: {
    json: (block, generator) => {
      const
        comparator = block.getFieldValue('OP'),
        leftExp = generator.valueToCode(block, 'A', 0) || '0',
        rightExp = generator.valueToCode(block, 'B', 0) || '0',

        blockPayload = JSON.stringify({
          compare: {
            left: JSON.parse(leftExp),
            comparator: comparator?.toLowerCase() || null,
            right: JSON.parse(rightExp),
          },
        })

      return [ blockPayload, 0 ]
    }
  }
}
