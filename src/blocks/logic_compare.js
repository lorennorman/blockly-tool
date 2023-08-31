export const
  toolbox = {
    category: 'Logic',
  },

  commonType = 'logic_compare',

  generators = {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for logic_compare.js"'
    },

    markdown: (block, generator) => {
      return '# logic_compare.js'
    }
  }
