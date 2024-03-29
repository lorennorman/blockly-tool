export default {
  type: "action_log",

  toolbox: {
    category: 'Actions',
    label: "Plug in a block to see its resolved value in the action's log."
  },

  visualization: {
    colour: "0",
    tooltip: [
      "Executes the block you plug in and reveals its final value or error message.",
      "---------------",
      "Parameters:",
      "EXPRESSION - a block you'd like to see the resolved value of"
    ].join('\n'),
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    ["Log:", {
      inputValue: 'EXPRESSION',
       // check: ['expression', 'String'],
      shadow: 'text'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        logAction: {
          line: JSON.parse(generator.valueToCode(block, 'EXPRESSION', 0))
        }
      }

      return JSON.stringify(payload)
    }
  }
}
