export default {
  type: 'math_arithmetic',

  toolbox: {
    category: 'Math',
  },

  generators: {
    json: (block, generator) => {
      const
        operatorMap = {
          ADD: '+',
          MINUS: '-',
          MULTIPLY: '*',
          DIVIDE: '/',
          POWER: '^'
        },
        operator = block.getFieldValue('OP'),
        leftExp = generator.valueToCode(block, 'A', 0) || '0',
        rightExp = generator.valueToCode(block, 'B', 0) || '0',

        blockPayload = JSON.stringify({
          arithmetic: {
            left: JSON.parse(leftExp),
            operator: operator
              ? operatorMap[operator]
              : null,
            right: JSON.parse(rightExp)
          }
        })

      return [ blockPayload, 0 ]
    }
  }
}
