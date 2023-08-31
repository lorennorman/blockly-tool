export const
  toolbox = { },

  commonType = 'controls_if_if',

  generators = {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for controls_if_if.js"'
    },

    markdown: (block, generator) => {
      return '# controls_if_if.js'
    }
  }
