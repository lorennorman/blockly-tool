export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'math_number',

  generators: {
    json: (block, generator) => {
      return [Number(block.getFieldValue('NUM')) || '0', 0]
    }
  }
}
