export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'text',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for text.js"'
    },

    markdown: (block, generator) => {
      return '# text.js'
    }
  }
}
