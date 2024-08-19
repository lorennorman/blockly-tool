export default {
  type: 'io_variables_get',

  toolbox: {
    category: "Variables"
  },

  visualization: {
    colour: 240
  },

  connections: {
    mode: 'value',
    output: "String",
  },

  lines: [
    ['', {
      field: 'VAR',
      type: 'field_variable'
    }]
  ],

  generators: {
    json: block => {
      const
        name = block.getField('VAR').getText(),
        blockPayload = JSON.stringify({
          getVariable: {
            name
          }
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { name } = blockObject.getVariable,
        id = helpers.registerVariable(name)

      return {
        type: "io_variables_get",
        fields: {
          VAR: { id }
        },
      }
    }
  }
}
