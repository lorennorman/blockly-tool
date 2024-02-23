export default {
  type: 'logic_operation',

  toolbox: {
    category: 'Logic',
  },

  generators: {
    json: (block, generator) => {
      const
        operator = block.getFieldValue('OP'),
        leftExp = generator.valueToCode(block, 'A', 0) || false,
        rightExp = generator.valueToCode(block, 'B', 0) || false,

        blockPayload = JSON.stringify({
          logic: {
            left: JSON.parse(leftExp),
            comparator: operator?.toLowerCase() || null,
            right: JSON.parse(rightExp),
          },
        })

      return [ blockPayload, 0 ]
    }
  }
}
