export default {
  type: "math_map",

  toolbox: { },

  visualization: {
    colour: 120,
    tooltip: "Scale a value from one range to another"
  },

  connections: {
    mode: "value",
    output: "number",
  },

  lines: [
    "Map",

    [ "Value:", {
      inputValue: "VALUE",
      shadow: "io_math_number"
    }],

    [ "From:", {
      inputValue: "FROM_RANGE",
      check: 'range',
      shadow: {
        type: "math_range",
        inputs: {
          FROM: { shadow: {
            type: 'io_math_number',
            fields: { NUM: '0' }
          }},
          TO: { shadow: {
            type: 'io_math_number',
            fields: { NUM: '100' }
          }}
        }
      }
    }],

    [ "To:", {
      inputValue: "TO_RANGE",
      check: 'range',
      shadow: {
        type: "math_range",
        inputs: {
          FROM: { shadow: {
            type: 'io_math_number',
            fields: { NUM: '0.0' }
          }},
          TO: { shadow: {
            type: 'io_math_number',
            fields: { NUM: '1.0' }
          }}
        }
      }
    }],
  ],

  generators: {
    json: (block, generator) => {
      const
        value = JSON.parse(generator.valueToCode(block, 'VALUE', 0)),
        from = JSON.parse(generator.valueToCode(block, 'FROM_RANGE', 0)),
        to = JSON.parse(generator.valueToCode(block, 'TO_RANGE', 0)),
        payload = { mapValue: {value, from, to } }

      return [ JSON.stringify(payload), 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { value, to, from } = blockObject.mapValue,
        inputs = {
          VALUE: helpers.expressionToBlock(value, { shadow: 'io_math_number' }),
          FROM_RANGE: helpers.expressionToBlock(from, {
            shadow: {
              type: 'math_range',
              inputs: {
                FROM: { shadow: {
                  type: 'io_math_number',
                  fields: { NUM: '0' }
                } },
                TO: { shadow: {
                  type: 'io_math_number',
                  fields: { NUM: '100' }
                } },
              }
            }
          }),
          TO_RANGE: helpers.expressionToBlock(to, {
            shadow: {
              type: 'math_range',
              inputs: {
                FROM: { shadow: {
                  type: 'io_math_number',
                  fields: { NUM: '0' }
                } },
                TO: { shadow: {
                  type: 'io_math_number',
                  fields: { NUM: '1' }
                } },
              }
            }
          }),
        }

      return { type: 'math_map', inputs }
    }
  }
}
