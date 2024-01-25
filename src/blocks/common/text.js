export default {
  type: 'text',

  toolbox: {
    category: 'Values',
    label: 'A string of text'
  },

  generators: {
    json: (block, generator) => {
      const text = block.getFieldValue('TEXT')

      return [ text, 0 ]
    }
  }
}
