export default {
  type: 'variables_set',

  toolbox: { },

  generators: {
    json: (block, generator) => {
      const
        variableName = block.getField('VAR').getText(),
        value = generator.valueToCode(block, 'VALUE', 0),
        defaultedValue = value || (value !== 0 && value !== null) && 'false'

      return `{ "set_variable": "${variableName}", "value": ${defaultedValue} }`
    }
  }
}

