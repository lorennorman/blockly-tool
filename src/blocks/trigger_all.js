export default {
  toolbox: {
    category: 'Triggers',
  },

  json: {
    "type": "trigger_all",
    "message0": "All: %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "TRIGGERS"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 90,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for trigger_all.js"'
    },

    markdown: (block, generator) => {
      return '# trigger_all.js'
    }
  }
}
