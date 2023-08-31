export const
  toolbox = { },

  commonType = 'controls_if_else',

  generators = {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for controls_if_else.js"'
    },

    markdown: (block, generator) => {
      return '# controls_if_else.js'
    }
  }
