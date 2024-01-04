export default {
  type: "selector_comparison",

  toolbox: {
    category: 'Comparisons',
  },

  visualization: {
    "colour": 230,
  },

  connections: {
    mode: "value",
    output: "comparison_operator"
  },

  lines: [
    [ "", {
      field: "OPERATOR",
      options: [
        [ "any", "any" ],
        [ ">", "gt" ],
        [ ">=", "gte" ],
        [ "<", "lt" ],
        [ "<=", "lte" ],
        [ "=", "equal_to" ],
        [ "≠", "not_equal_to" ],
        [ "includes", "inc" ]
      ]
    }],
  ],

  generators: {
    json: block => [ block.getFieldValue('OPERATOR'), 0 ]
  }
}
