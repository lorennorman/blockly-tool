export default {
  commonType: 'text_multiline',

  toolbox: {
    category: 'Values',
  },

  generators: {
    json: (block, generator) => {
      const text = block.getFieldValue('TEXT')

      return [ text, 0 ]
    }
  }
}
