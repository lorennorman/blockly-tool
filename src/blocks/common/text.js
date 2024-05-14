export default {
  type: 'text',

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
