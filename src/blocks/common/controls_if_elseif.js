export default {
  toolbox: { },

  commonType: 'controls_if_elseif',

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for controls_if_elseif.js"'
    },

    markdown: (block, generator) => {
      return '# controls_if_elseif.js'
    }
  }
}
