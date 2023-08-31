export default {
  toolbox: { },

  commonType: 'variables_set',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for variables_set.js"'
    },

    markdown: (block, generator) => {
      return '# variables_set.js'
    }
  }
}

