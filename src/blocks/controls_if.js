export default {
  toolbox: {
    category: 'Logic',
  },

  commonType: 'controls_if',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for controls_if.js"'
    },

    markdown: (block, generator) => {
      return '# controls_if.js'
    }
  }
}
