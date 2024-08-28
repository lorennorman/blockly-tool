export default {
  type: 'io_logic_boolean',

  toolbox: {
    category: 'Logic'
  },

  visualization: {
    colour: 60,
    tooltip: "A true or false value!"
  },

  connections: {
    mode: "value",
    output: "boolean",
  },

  lines: [
    ["", {
      field: "BOOL",
      options: [
        ['true', 'TRUE'],
        ['false', 'FALSE'],
      ],
    }]
  ],

  generators: {
    json: block => {
      const bool = block.getFieldValue('BOOL') === 'TRUE'

      return [ JSON.stringify(bool), 0 ]
    }
  }
}
