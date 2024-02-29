export default {
  type: 'logic_boolean',

  toolbox: {
    category: 'Logic'
  },

  generators: {
    json: (block, generator) => {
      const bool = block.getFieldValue('BOOL') === 'TRUE'

      return [ JSON.stringify(bool), 0 ]
    }
  }
}
