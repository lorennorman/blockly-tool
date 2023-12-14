export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'logic_boolean',

  generators: {
    json: (block, generator) => {
      const bool = block.getFieldValue('BOOL') === 'TRUE'
      return [bool, 0]
    }
  }
}
