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
        leftExp = generator.valueToCode(block, 'A', 0) || 'null',
        rightExp = generator.valueToCode(block, 'B', 0) || 'null',

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
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        payload = blockObject.arithmetic,
        operatorMap = {
          '+': 'ADD',
          '-': 'MINUS',
          '*': 'MULTIPLY',
          '/': 'DIVIDE',
          '^': 'POWER',
        },
        fields = {
          OP: operatorMap[payload.operator]
        },
        inputs = {
          A: helpers.expressionToBlock(payload.left, { shadow: 'math_number' }),
          B: helpers.expressionToBlock(payload.right, { shadow: 'math_number' }),
        }

      return { type: 'math_arithmetic', fields, inputs }
    }
  }
}
