export default {
  commonType: 'logic_null',

  toolbox: {
    category: 'Values',
  },

  generators: {
    json: (block, generator) => {
      return [ null, 0]
    }
  }
}
