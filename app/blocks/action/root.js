
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

    [ "...delay this Action by %DELAY", {
      align: "LEFT",
      field: 'DELAY',
      options: [
        ["no delay", "0"],
        ["5s", "5"],
        ["5m", "300"],
        ["5h", "1800"],
      ]
    }],

    [ "...repeat Actions %ON_EXISTING_DELAY", {
      field: 'ON_EXISTING_DELAY',
      options: [
        ["reset existing delays", "reset"],
        ["start new delays", "duplicate"],
      ]
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
      const parseStatementToCodeAsJson = statementInputName => {
        let expressions = []

        try {
          let expressionsJson = generator.statementToCode(block, statementInputName)

          try {
            expressions = JSON.parse(`[${expressionsJson}]`)
          } catch(e) {
            console.error("Error parsing JSON:", expressionsJson)
            console.error(e)
          }
        } catch(e) {
          console.error(`Error calling statementToCode on root input ${statementInputName}:`)
          console.error(e)
        }

        return expressions
      }

      return JSON.stringify({
        version: "1.0.0-beta.1",
        settings: {},
        triggers: parseStatementToCodeAsJson('TRIGGERS'),
        expressions: parseStatementToCodeAsJson('EXPRESSIONS'),
      }, null, 2)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { triggers, expressions } = blockObject

      return {
        "type": "action_root",
        "movable": false,
        "deletable": false,
        "x": 50,
        "y": 50,
        "inputs": {
          "TRIGGERS": helpers.arrayToStatements(triggers),
          "EXPRESSIONS": helpers.arrayToStatements(expressions),
        }
      }
    }
  }
}
