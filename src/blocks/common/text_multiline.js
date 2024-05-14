export default {
  type: 'text_multiline',

  toolbox: {
    category: 'Text'
  },

  generators: {
    json: block => {
      const text = block.getFieldValue('TEXT')

      return [ JSON.stringify(text), 0 ]
    }
  }
}
