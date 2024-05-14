export default {
  type: 'variables_get',

  toolbox: {
    category: "Variables"
  },

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
  }
}
