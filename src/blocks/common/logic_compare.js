export default {
  toolbox: {
    category: 'Logic',
  },

  commonType: 'logic_compare',

  generators: {
    json: (block, generator) => {
      const
        operator = block.getFieldValue('OP'),
        argument0 = generator.valueToCode(block, 'A', 0),
        argument1 = generator.valueToCode(block, 'B', 0),

        lines = [
          `"a": ${argument0}`,
          `"op": "${operator}"`,
          `"b": ${argument1}`,
        ],

        indentedLines = generator.prefixLines(lines.join(',\n'), generator.INDENT)

      return [`{\n${indentedLines}\n}`, 0]
    },

    markdown: (block, generator) => {
      return '# logic_compare.js'
    }
  }
}
