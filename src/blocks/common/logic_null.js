export default {
  toolbox: {
    category: 'Values',
  },

  commonType: 'logic_null',

  generators: {
    json: (block, generator) => {
      return ['null', 0]
    },

    markdown: (block, generator) => {
      return '# logic_null.js'
    }
  }
}
