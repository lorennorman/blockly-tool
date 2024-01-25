export default {
  type: 'logic_boolean',

  toolbox: {
    category: 'Values',
    label: 'A boolean'
  },

  generators: {
    json: (block, generator) => {
      const bool = block.getFieldValue('BOOL') === 'TRUE'
      return [bool, 0]
    }
  }
}
