export default {
  type: 'io_math_number',

  toolbox: {
    category: 'Math'
  },

  visualization: {
    colour: 120,
    tooltip: "",
  },

  connections: {
    mode: "value",
    output: "number",
  },

  // describes each line of the block, from top to bottom
  lines: [
    ["", {
      field: 'NUM',
      text: '0'
    }]
  ],

  generators: {
    json: block => {
      return [Number(block.getFieldValue('NUM')) || '0', 0]
    }
  }
}
