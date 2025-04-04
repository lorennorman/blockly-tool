export default {
  type: "io_text",

  toolbox: {
    category: 'Text',
    label: "Single-line text string"
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
    ["\"", {
      field: 'TEXT',
      text: ''
    }]
  ],

  // generators for this block type
  // these get aggregated and registered together
  generators: {
    json: block => {
      const text = block.getFieldValue('TEXT')

      return [ JSON.stringify(text), 0 ]
    }
  }
}
