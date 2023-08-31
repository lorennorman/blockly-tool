export default {
  toolbox: {
    category: 'Logic',
  },

  commonType: 'logic_negate',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for logic_negate.js"'
    },

    markdown: (block, generator) => {
      return '# logic_negate.js'
    }
  }
}
