export default {
  type: "when_scheduled",

  toolbox: {
    category: "When..."
  },

  connections: {},

  visualization: {
    colour: 30,
    tooltip: [
      "Add a Schedule block to configure when this action executes.",
      "Add statement blocks to \"Do:\" to configure what this action does."
      ].join("\n")
  },

  lines: [
    [ "Scheduled:", {
      inputValue: 'SCHEDULE'
    } ],

    [ "Do:", {
      inputStatement: "EXPRESSIONS",
      // check: "expression"
    }],
  ],

  generators: {
    json: (block, generator) => {
      let schedule = '', expressionsJson, expressions = []

      try {
        expressionsJson = generator.statementToCode(block, `EXPRESSIONS`)

        try {
          expressions = JSON.parse(`[${expressionsJson}]`)
        } catch(e) {
          console.error("Error parsing JSON:", expressionsJson)
          console.error(e)
        }
      } catch(e) {
        console.error("Error calling statementToCode on expression statements:")
        console.error(e)
      }

      return JSON.stringify({
        whenScheduled: {
          schedule,
          expressions
        }
      })
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { schedule, expressions } = blockObject.whenScheduled

      return {
        type: "when_scheduled",
        inputs: {
          EXPRESSIONS: helpers.arrayToStatements(expressions)
        }
      }
    }
  }
}
