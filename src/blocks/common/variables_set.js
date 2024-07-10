export default {
  type: 'variables_set',

  // toolbox: {
  //   category: "Variables"
  // },

  generators: {
    json: (block, generator) => {
      const
        variableName = block.getField('VAR').getText(),
        value = generator.valueToCode(block, 'VALUE', 0)

      const
        defaultedValue = value
          ? JSON.parse(value)
          : (value !== 0 && value !== null) && null,
        blockPayload = JSON.stringify({
          setVariable: {
            name: variableName,
            value: defaultedValue
          }
        })

      return blockPayload
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { name, value } = blockObject.setVariable,
        id = helpers.registerVariable(name)

      return {
        type: "variables_set",
        fields: {
          VAR: { id }
        },
        inputs: {
          VALUE: helpers.expressionToBlock(value, { shadow: "io_text" })
        }
      }
    }
  }
}
