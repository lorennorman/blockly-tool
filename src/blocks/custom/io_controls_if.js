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
    [ "if", { inputValue: 'IF0' }],
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
          ifClause = generator.valueToCode(block, `IF${index}`, 0) || 'false',
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
  }
}
