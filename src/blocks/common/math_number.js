export default {
  type: 'math_number',

  toolbox: {
    category: 'Math'
  },

  generators: {
    json: (block, generator) => {
      return [Number(block.getFieldValue('NUM')) || '0', 0]
    }
  }
}
