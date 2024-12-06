const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./action_settings/mutator.js?key=${random}`)).default

export default {
  type: "action_root",

  connections: {},

  visualization: {
    colour: "0",
    tooltip: "Add Triggers to determine when this Action runs.\nAdd Actions to determine what this Action does."
  },

  mutator,

  lines: [
    [ "Triggers:", "LEFT" ],
    [ "", {
      inputStatement: "TRIGGERS",
      check: 'trigger'
    }],

    [ "", "LEFT" ],

    [ "Actions:", "LEFT" ],
    [ "", {
      inputStatement: "EXPRESSIONS",
      check: "expression"
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

      const
        seconds = block.delaySeconds,
        mode = block.delayMode,
        delay = (seconds > 0)
          ? { seconds, mode }
          : undefined

      return JSON.stringify({
        version: "1.0.0-beta.1",
        settings: { delay },
        triggers: parseStatementToCodeAsJson('TRIGGERS'),
        expressions: parseStatementToCodeAsJson('EXPRESSIONS'),
      }, null, 2)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { triggers, expressions, settings } = blockObject

      return {
        type: "action_root",
        movable: false,
        deletable: false,
        x: 50,
        y: 50,
        extraState: {
          delaySeconds: settings.delay?.seconds || 0,
          delayMode: settings.delay?.mode || 'extend'
        },
        inputs: {
          "TRIGGERS": helpers.arrayToStatements(triggers),
          "EXPRESSIONS": helpers.arrayToStatements(expressions),
        }
      }
    }
  }
}
