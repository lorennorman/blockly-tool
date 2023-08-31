export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'logic_null',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for logic_null.js"'
    },

    markdown: (block, generator) => {
      return '# logic_null.js'
    }
  }
}
