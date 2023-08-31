export default {
  toolbox: { },

  commonType: 'variables_get',

  generators: {
    json: (block, generator) => {
      const variableName = block.getField('VAR').getText()
      return [`{ "variable": "${variableName}" }`, 0]
    },

    markdown: (block, generator) => {
      return '# variables_get.js'
    }
  }
}
