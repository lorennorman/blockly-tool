export default {
  type: 'variables_set',

  toolbox: {
    category: "Variables"
  },

  generators: {
    json: (block, generator) => {
      const
        variableName = block.getField('VAR').getText(),
        value = generator.valueToCode(block, 'VALUE', 0)

      const
        defaultedValue = value
          ? JSON.parse(value)
          : (value !== 0 && value !== null) && 'false',
        blockPayload = JSON.stringify({
          setVariable: {
            name: variableName,
            value: defaultedValue
          }
        })

      return blockPayload
    }
  }
}
