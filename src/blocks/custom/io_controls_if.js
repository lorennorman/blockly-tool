import mutator from './io_controls_if/mutator.js'


export default {
  type: 'io_controls_if',

  toolbox: {
    category: 'Logic'
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
    [ "if", { inputValue: 'IF0', shadow: 'logic_boolean' }],
    [ "do", { inputStatement: 'THEN0' }],
    [ "else if", { inputDummy: 'ELSE_IF_LABEL' }],
    [ "else", { inputDummy: 'ELSE_LABEL' }]
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        conditional: {
          ifThens: []
        }
      }

      let index = 0
      while(block.getInput(`IF${index}`)) {
        const
          ifClause = generator.valueToCode(block, `IF${index}`, 0) || 'null',
          thenClause = generator.statementToCode(block, `THEN${index}`) || ''

        payload.conditional.ifThens.push({
          if: JSON.parse(ifClause),
          then: JSON.parse(`[ ${thenClause} ]`),
        })

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

      const
        { ifThens } = payload,
        inputs = {}

      ifThens.forEach((item, index) => {
        if(item.if !== null) { inputs[`IF${index}`] = helpers.expressionToBlock(item.if, { shadow: 'logic_boolean' }) }
        if(item.then) { inputs[`THEN${index}`] = helpers.arrayToStatements(item.then) }
      })

      if(payload.else) {
        inputs.ELSE = helpers.arrayToStatements(payload.else)
      }

      return {
        type: "io_controls_if",
        inputs,
        extraState: {
          elseIfCount: ifThens.length-1,
          elsePresent: !!payload.else
        }
      }
    }
  }
}
