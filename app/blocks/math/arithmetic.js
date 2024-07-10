export default {
  type: 'io_math_arithmetic',

  toolbox: {
    category: 'Math',
  },

  visualization: {
    inputsInline: true,
    colour: 120,
  },

  lines: [
    [ "", { inputValue: 'A', shadow: 'io_math_number'}],
    [ "", {
      field: 'OP',
      options: [
        ['+', 'ADD'],
        ['-', 'MINUS'],
        ['x', 'MULTIPLY'],
        ['/', 'DIVIDE'],
        ['^', 'POWER'],
      ]
    }],
    [ "", { inputValue: 'B', shadow: 'io_math_number'}],
  ],

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
          A: helpers.expressionToBlock(payload.left, { shadow: 'io_math_number' }),
          B: helpers.expressionToBlock(payload.right, { shadow: 'io_math_number' }),
        }

      return { type: 'io_math_arithmetic', fields, inputs }
    }
  }
}
