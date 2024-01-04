export default {
  type: 'variables_get',

  toolbox: { },

  generators: {
    json: (block, generator) => {
      const variableName = block.getField('VAR').getText()
      return [`{ "variable": "${variableName}" }`, 0]
    }
  }
}
