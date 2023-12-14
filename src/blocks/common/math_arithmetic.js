export default {
  toolbox: {
    category: 'Math',
  },

  commonType: 'math_arithmetic',

  generators: {
    json: (block, generator) => {
      const
        operator = block.getFieldValue('OP'),
        argument0 = generator.valueToCode(block, 'A', 0) || '0',
        argument1 = generator.valueToCode(block, 'B', 0) || '0',

        lines = [
          `"math": "arithmetic"`,
          `"a": ${argument0}`,
          `"op": "${operator}"`,
          `"b": ${argument1}`,
        ],

        indentedLines = generator.prefixLines(lines.join(',\n'), generator.INDENT)

      return [`{\n${indentedLines}\n}`, 0]
    }
  }
}
