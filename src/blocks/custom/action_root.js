
export default {
  toolbox: { },

  json: {
    "type": "action_root",
    "message0": "Action Root %1 Max Frequency: %2 %3 %4 Triggers %5 Any: %6 %7 Actions %8 All: %9",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "ACTION_FREQUENCY",
        "options": [
          [
            "10 seconds",
            "10"
          ],
          [
            "30 seconds",
            "30"
          ],
          [
            "1 minute",
            "60"
          ],
          [
            "5 minutes",
            "300"
          ],
          [
            "1 hour",
            "3600"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "TRIGGERS"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "ACTIONS"
      }
    ],
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      const
        frequency = block.getFieldValue('ACTION_FREQUENCY'),
        triggers = generator.statementToCode(block, 'TRIGGERS'),
        actions = generator.statementToCode(block, 'ACTIONS'),

        lines = [
          `"blocklyActionsVersion": "1.0.0"`,
          `"frequency": ${frequency}`,
          `"triggers": [`,
          triggers,
          `],`,
          `"actions": [`,
          actions,
          `]`
        ],

        indentedLines = generator.prefixLines(lines.join('\n'), generator.INDENT)

      return `{\n${ indentedLines }\n}`
    },

    markdown: (block, generator) => {
      const
        frequency = block.getFieldValue('ACTION_FREQUENCY'),
        triggers = generator.statementToCode(block, 'TRIGGERS'),
        actions = generator.statementToCode(block, 'ACTIONS')

      return `# Action Root
        - Frequency: ${frequency}

        ## Triggers:
        ${triggers}

        ## Actions:
        ${actions}
      `
    }
  }
}







