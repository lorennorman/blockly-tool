export default {
  type: "io_text",

  toolbox: {
    category: 'Text',
  },

  visualization: {
    colour: 180,
    tooltip: "A String of text",
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
