export default {
  type: 'io_variables_set',

  toolbox: {
    category: "Variables"
  },

  visualization: {
    inputsInline: true,
    colour: 240
  },

  connections: {
    mode: 'statement',
    output: "expression",
    next: "expression",
  },

  lines: [
    ['Set variable %VAR =', {
      field: 'VAR',
      type: 'field_variable'
    }],

    ['', {
      inputValue: "VALUE",
      shadow: "io_text",
    }]
  ],

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
        type: "io_variables_set",
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
