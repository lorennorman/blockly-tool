export default {
  toolbox: { },

  commonType: 'variables_get',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for variables_get.js"'
    },

    markdown: (block, generator) => {
      return '# variables_get.js'
    }
  }
}
