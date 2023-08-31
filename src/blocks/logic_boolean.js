export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'logic_boolean',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for logic_boolean.js"'
    },

    markdown: (block, generator) => {
      return '# logic_boolean.js'
    }
  }
}
