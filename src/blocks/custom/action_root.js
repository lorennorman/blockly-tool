
export default {
  toolbox: { },

  json: {
    "type": "action_root",
    "message0": "Action Root %1 Trigger: %2 Action: %3",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "TRIGGER",
        "check": "trigger",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "ACTION",
        "check": "action",
        "align": "RIGHT"
      }
    ],
    "inputsInline": false,
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
          `"triggers": [\n${triggers}\n]`,
          `"actions": [\n${actions}\n]`,
        ],

        indentedLines = generator.prefixLines(lines.join(',\n'), generator.INDENT)

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







