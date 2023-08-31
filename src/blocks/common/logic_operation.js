export default {
  toolbox: {
    category: 'Logic',
  },

  commonType: 'logic_operation',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for logic_operation.js"'
    },

    markdown: (block, generator) => {
      return '# logic_operation.js'
    }
  }
}
