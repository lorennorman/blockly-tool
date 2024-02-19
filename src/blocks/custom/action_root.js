
export default {
  type: "action_root",

  toolbox: { },

  visualization: {
    colour: 60,
    extensions: [  ],
    tooltip: [

    ].join('\n')
  },

  lines: [
    [ "Actions", "CENTER" ],

    "Settings",

    "Expressions",

    [ "", {
      inputValue: "EXPRESSION_1",
      check: "expression",
    }],

    [ "", {
      inputValue: "EXPRESSION_2",
      check: "expression",
    }],

    [ "", {
      inputValue: "EXPRESSION_3",
      check: "expression",
    }],

    [ "", {
      inputValue: "EXPRESSION_4",
      check: "expression",
    }],
  ],

  generators: {
    json: (block, generator) => {
      const expressions = []
      for(let i = 1; i <= 4; i++) {
        expressions.push(generator.valueToCode(block, `EXPRESSION_${i}`, 0))
      }

      return JSON.stringify({
        version: "1.0.0-beta.1",
        settings: {},
        actions: expressions,
      }, null, 2)
    }
  }
}







