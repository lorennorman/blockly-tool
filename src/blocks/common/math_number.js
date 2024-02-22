export default {
  type: 'math_number',

  toolbox: {
    category: 'Values',
    label: "A number, whole or decimal"
  },

  generators: {
    json: (block, generator) => {
      return [Number(block.getFieldValue('NUM')) || '0', 0]
    }
  }
}
