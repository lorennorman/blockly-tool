export default {
  commonType: 'text',

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
