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
      const triggers = generator.statementToCode(block, 'TRIGGERS')
      return `{ "all": [\n${triggers}\n]}`
    },

    markdown: (block, generator) => {
      return '# trigger_all.js'
    }
  }
}
