export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'math_number',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for math_number.js"'
    },

    markdown: (block, generator) => {
      return '# math_number.js'
    }
  }
}
