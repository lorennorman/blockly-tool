export default {
  toolbox: { },

  commonType: 'math_change',

  generators: {
    json: (block, generator) => {
      const
        variableName = block.getField('VAR').getText(),
        delta = generator.valueToCode(block, 'DELTA', 0)

      return `{ "change_variable": "${variableName}", "delta": ${delta} }`
    },

    markdown: (block, generator) => {
      return '# math_change.js'
    }
  }
}
