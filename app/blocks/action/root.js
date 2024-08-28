
export default {
  type: "action_root",

  toolbox: {},
  connections: {},

  visualization: {
    colour: "0",
    extensions: [  ],
    tooltip: "Add Triggers to determine when this Action runs.\nAdd Actions to determine what this Action does."
  },

  lines: [
    [ "", "LEFT" ],
    [ "Triggers:", "LEFT" ],
    [ "", {
      inputStatement: "TRIGGERS",
      check: 'trigger'
    }],

    [ "", "LEFT" ],
    [ "Actions:", "LEFT" ],
    [ "", {
      inputStatement: "EXPRESSIONS",
      // check: "expression"
    }],

    [ "", "LEFT" ],
  ],

  generators: {
    json: (block, generator) => {
      let expressionsJson, expressions = []

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
        version: "1.0.0-beta.1",
        settings: {},
        expressions,
      }, null, 2)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { expressions } = blockObject

      return {
        "type": "action_root",
        "movable": false,
        "deletable": false,
        "x": 50,
        "y": 50,
        "inputs": {
          "EXPRESSIONS": helpers.arrayToStatements(expressions)
        }
      }
    }
  }
}
