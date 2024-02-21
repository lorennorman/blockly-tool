export default {
  type: 'variables_get',

  toolbox: {
    category: "Variables"
  },

  generators: {
    json: (block, generator) => {
      const variableName = block.getField('VAR').getText()
      return [`{ "getVariable": "${variableName}" }`, 0]
    }
  }
}
