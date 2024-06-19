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
      const payload = blockObject.getVariable

      return {
        type: "variables_get",
        fields: {
          VAR: payload.name
        }
      }
    }
  }
}
