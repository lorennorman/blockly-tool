export default {
  type: 'text',

  toolbox: {
    category: 'Text'
  },

  generators: {
    json: (block, generator) => {
      const text = block.getFieldValue('TEXT')

      return [ JSON.stringify(text), 0 ]
    }
  }
}
