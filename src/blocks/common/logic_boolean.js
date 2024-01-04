export default {
  commonType: 'logic_boolean',

  toolbox: {
    category: 'Values',
  },

  generators: {
    json: (block, generator) => {
      const bool = block.getFieldValue('BOOL') === 'TRUE'
      return [bool, 0]
    }
  }
}
