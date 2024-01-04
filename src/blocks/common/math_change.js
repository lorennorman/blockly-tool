export default {
  type: 'math_change',

  toolbox: { },

  generators: {
    json: (block, generator) => {
      const
        variableName = block.getField('VAR').getText(),
        delta = generator.valueToCode(block, 'DELTA', 0)

      return `{ "change_variable": "${variableName}", "delta": ${delta} }`
    }
  }
}
