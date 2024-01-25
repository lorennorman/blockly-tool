export default {
  type: 'text_multiline',

  toolbox: {
    category: 'Values',
    label: "A multi-line string of text"
  },

  generators: {
    json: (block, generator) => {
      const text = block.getFieldValue('TEXT')

      return [ text, 0 ]
    }
  }
}
