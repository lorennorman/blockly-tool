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
        "name": "OPERATOR",
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
    json: block => [ block.getFieldValue('OPERATOR'), 0 ],

    markdown: (block, generator) => '# comparison_selector.js'
  }
}
