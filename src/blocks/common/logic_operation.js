export default {
  commonType: 'logic_operation',

  toolbox: {
    category: 'Logic',
  },

  generators: {
    json: (block, generator) => {
      const
        operator = block.getFieldValue('OP'),
        argument0 = generator.valueToCode(block, 'A', 0) || 'false',
        argument1 = generator.valueToCode(block, 'B', 0) || 'false',

        lines = [
          `"logic": "operation"`,
          `"a": ${argument0}`,
          `"op": "${operator}"`,
          `"b": ${argument1}`,
        ],

        indentedLines = generator.prefixLines(lines.join(',\n'), generator.INDENT)

      return [`{\n${indentedLines}\n}`, 0]

    }
  }
}
