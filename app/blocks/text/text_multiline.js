export default {
  type: 'io_text_multiline',

  toolbox: {
    category: 'Text'
  },

  visualization: {
    colour: 180,
    tooltip: "",
  },

  connections: {
    mode: "value",
    output: "String",
  },

  lines: [
    ["P", {
      field: 'TEXT',
      multiline_text: ''
    }]
  ],

  generators: {
    json: block => {
      const text = block.getFieldValue('TEXT')

      return [ JSON.stringify(text), 0 ]
    }
  }
}
