export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'text_multiline',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for text_multiline.js"'
    },

    markdown: (block, generator) => {
      return '# text_multiline.js'
    }
  }
}
