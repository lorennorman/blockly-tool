export default {
  toolbox: { },

  commonType: 'math_change',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for math_change.js"'
    },

    markdown: (block, generator) => {
      return '# math_change.js'
    }
  }
}
