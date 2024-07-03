export default {
  type: "when_feeds_update",

  toolbox: {
    category: "When..."
  },

  connections: {},

  visualization: {
    colour: 30,
    tooltip: [
      "Drag statement blocks into the \"Do\" list to build a custom Action",
      "They will execute any time a feed they reference gets a new data point."
      ].join("\n")
  },

  lines: [
    [ "Do:", {
      inputStatement: "EXPRESSIONS",
      // check: "expression"
    }],

    [ "%DELAY_SECONDS after any", {
      align: "CENTER",
      field: "DELAY_SECONDS",
      options: [
        [ "immediately", "0" ],
        [ "ten seconds", "10" ],
        [ "one minute", "60" ],
        [ "15 minutes", "900" ],
        [ "thirty minutes", "1800" ],
        [ "one hour", "3600" ],
        [ "6 hours", "21600" ],
        [ "one day", "86400" ],
      ]
    }],

    [ "referenced feed updates, and", "CENTER" ],

    [ "%EXTEND_TIMER timers.", {
      align: "CENTER",
      field: "EXTEND_TIMER",
      options: [
        [ "replace existing", "true" ],
        [ "allow multiple", "false" ],
      ]
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
        whenFeedsUpdate: { expressions, x, y }
      }, null, 2)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { expressions, x, y } = blockObject.whenFeedsUpdate

      return {
        type: "when_feeds_update",
        x, y,
        inputs: {
          EXPRESSIONS: helpers.arrayToStatements(expressions)
        }
      }
    }
  }
}
