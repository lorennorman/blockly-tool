export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'text_multiline',

  generators: {
    json: (block, generator) => {
      const text = block.getFieldValue('TEXT')

      return [ text, 0 ]
    }
  }
}
