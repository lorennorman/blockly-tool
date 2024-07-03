export default {
  type: "when_feed_changes",

  toolbox: {
    category: "When..."
  },

  connections: {},

  visualization: {
    colour: 30,
    tooltip: [
      "Set the change criteria that will trigger this Action.",
      "Drag statement blocks into the \"Do\" list to define the Action",
      ].join("\n")
  },

  lines: [
    // [ "When Feed Changes", "CENTER" ],

    [ "When %1 %2 %3", {
      fields: {
        FEED_KEY: {
          options: [
            [ "Feed A", "a" ],
            [ "Feed B", "b" ],
            [ "Feed C", "c" ],
            [ "My Feed", "d" ],
          ]
        },
        CHANGE: {
          options: [
            [ "grows above", "grows" ],
            [ "shrinks below", "shrinks" ],
            [ "becomes", "becomes" ],
          ]
        },
        VALUE: {
          text: "0"
        }
      }
    }],

    [ "Do:", {
      inputStatement: "EXPRESSIONS",
      // check: "expression"
    }],

    [ "When it goes back", "LEFT" ],

    [ "Do:", {
      inputStatement: "BACK_EXPRESSIONS",
      // check: "expression"
    }],
  ],

  generators: {
    json: (block, generator) => {
      const { x, y } = block.relativeCoords
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
        whenFeedChanges: { expressions, x, y }
      }, null, 2)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { expressions, x, y } = blockObject.whenFeedChanges

      return {
        type: "when_feed_changes",
        x, y,
        inputs: {
          EXPRESSIONS: helpers.arrayToStatements(expressions)
        }
      }
    }
  }
}
