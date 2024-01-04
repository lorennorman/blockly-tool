export default {
  commonType: 'math_number',

  toolbox: {
    category: 'Values',
  },

  generators: {
    json: (block, generator) => {
      return [Number(block.getFieldValue('NUM')) || '0', 0]
    }
  }
}
