const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./if/mutator.js?key=${random}`)).default

export default {
  type: 'io_controls_if',

  toolbox: {
    category: 'Logic',
    label: "Conditional evaluation: if-elseif-else"
  },

  visualization: {
    colour: 60,
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  mutator,

  lines: [
    [ "if", { inputValue: 'IF0', shadow: 'io_logic_boolean' }],
    [ "do", { inputStatement: 'THEN0' }],
    [ "else if", { inputDummy: 'ELSE_IF_LABEL' }],
    [ "else", { inputDummy: 'ELSE_LABEL' }]
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        conditional: {}
      }

      let index = 0
      while(block.getInput(`IF${index}`)) {
        const
          ifClause = generator.valueToCode(block, `IF${index}`, 0) || 'null',
          thenClause = generator.statementToCode(block, `THEN${index}`) || ''

        payload.conditional[`if${index}`] = JSON.parse(ifClause)
        payload.conditional[`then${index}`] = JSON.parse(`[ ${thenClause} ]`)

        index += 1
      }

      if(block.getInput('ELSE')) {
        const elseClause = generator.statementToCode(block, 'ELSE') || ''

        payload.conditional.else = JSON.parse(`[${ elseClause }]`)
      }

      return JSON.stringify(payload)
    }
  },

  regenerators: {
    json: (bytecode, helpers) => {
      const payload = bytecode.conditional

      if(!payload) {
        throw new Error("No data for io_controls_if regenerator")
      }

      const inputs = {}

      let index = 0
      while(payload[`if${index}`] || payload[`then${index}`]) {
        inputs[`IF${index}`] = helpers.expressionToBlock(payload[`if${index}`], { shadow: 'io_logic_boolean' })
        inputs[`THEN${index}`] = helpers.arrayToStatements(payload[`then${index}`])

        index += 1
      }

      if(payload.else) {
        inputs.ELSE = helpers.arrayToStatements(payload.else)
      }

      return {
        type: "io_controls_if",
        inputs,
        extraState: {
          elseIfCount: index-1, // only count else-ifs, don't count initial if
          elsePresent: !!payload.else
        }
      }
    }
  }
}
