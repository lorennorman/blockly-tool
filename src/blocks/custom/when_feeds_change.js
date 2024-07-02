export default {
  type: "when_feeds_change",

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

    [ "...when a referenced feed changes", "CENTER" ],
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
        whenFeedsChange: { expressions }
      })
      // return JSON.stringify({
      //   version: "1.0.0-beta.1",
      //   settings: {},
      //   expressions,
      // }, null, 2)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { expressions } = blockObject.whenFeedsChange

      return {
        type: "when_feeds_change",
        inputs: {
          EXPRESSIONS: helpers.arrayToStatements(expressions)
        }
      }
    }
  }
}
