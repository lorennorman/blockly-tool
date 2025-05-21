export default {
  type: "io_math_round",

  toolbox: { },

  visualization: {
    inputsInline: true,
    colour: 120,
    tooltip: [
      "Round a value to the nearest whole number",
      "-------------",
      "Round: rounds up if .5 or higher, down otherwise",
      "Floor: rounds down",
      "Ceiling: rounds up",
    ].join("\n"),
  },

  connections: {
    mode: "value",
    output: "expression",
  },

  lines: [
    [ "%OPERATION", {
      field: "OPERATION",
      options: [
        ["Round", "round"],
        ["Floor", "floor"],
        ["Ceiling", "ceiling"],
      ]
    }],

    [ "%VALUE", {
      inputValue: "VALUE",
      shadow: "io_math_number"
    }],
  ],

  generators: {
    json: (block, generator) => {
      const
        value = JSON.parse(generator.valueToCode(block, 'VALUE', 0)),
        operation = block.getFieldValue('OPERATION'),
        payload = { round: { value, operation } }

      return [ JSON.stringify(payload), 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { value, operation } = blockObject.round,
        inputs = {
          VALUE: helpers.expressionToBlock(value, { shadow: 'io_math_number' }),
        },
        fields = {
          OPERATION: operation,
        }

      return { type: 'io_math_round', inputs, fields }
    }
  }
}
