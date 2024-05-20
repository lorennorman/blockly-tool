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
          line: block.getInputTargetBlock('EXPRESSION')
            ? JSON.parse(generator.valueToCode(block, 'EXPRESSION', 0))
            : null
        }
      }

      return JSON.stringify(payload)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.logAction

      if(!payload) {
        throw new Error("No data for action_log regenerator")
      }

      const inputsClause = payload.line !== null
        ? { inputs: { EXPRESSION: helpers.expressionToBlock(payload.line)}}
        : {}

      return {
        "type": "action_log",
        ...inputsClause
      }
    }
  }
}
