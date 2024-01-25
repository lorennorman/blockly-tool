export default {
  type: 'math_number',

  toolbox: {
    category: 'Values',
    label: "An integer"
  },

  generators: {
    json: (block, generator) => {
      return [Number(block.getFieldValue('NUM')) || '0', 0]
    }
  }
}
