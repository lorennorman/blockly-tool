export default {
  type: "io_text",

  toolbox: { category: 'Text' },

  // same as Blockly JSON
  visualization: {
    colour: 180,
    tooltip: "",
  },

  connections: {
    mode: "value",
    output: "string",
  },

  // describes each line of the block, from top to bottom
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
