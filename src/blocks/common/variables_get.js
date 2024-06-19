export default {
  type: 'variables_get',

  // toolbox: {
  //   category: "Variables"
  // },

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
        type: "variables_get",
        fields: {
          VAR: { id }
        },
      }
    }
  }
}
