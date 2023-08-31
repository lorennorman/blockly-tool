export default {
  toolbox: {
    category: 'Math',
  },

  commonType: 'math_arithmetic',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for math_arithmetic.js"'
    },

    markdown: (block, generator) => {
      return '# math_arithmetic.js'
    }
  }
}
