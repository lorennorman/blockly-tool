export default {
  type: 'math_number',

  toolbox: {
    category: 'Math'
  },

  generators: {
    json: block => {
      return [Number(block.getFieldValue('NUM')) || '0', 0]
    }
  }
}
