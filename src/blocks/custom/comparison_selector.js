export default {
  toolbox: {
    category: 'Comparisons',
  },

  json: {
    "type": "comparison_selector",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "any",
            "any"
          ],
          [
            ">",
            "gt"
          ],
          [
            ">=",
            "gte"
          ],
          [
            "<",
            "lt"
          ],
          [
            "<=",
            "lte"
          ],
          [
            "=",
            "eq"
          ],
          [
            "≠",
            "neq"
          ],
          [
            "includes",
            "includes"
          ]
        ]
      }
    ],
    "output": "comparison_operator",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => '""',

    markdown: (block, generator) => '# comparison_selector.js'
  }
}
