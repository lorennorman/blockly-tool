export default {
  disabled: true,

  type: 'io_logic_ternary',

  toolbox: {
    category: 'Logic',
  },

  visualization: {
    colour: 60,
  },

  lines: [
    ["if", { inputValue: 'IF', shadow: 'io_logic_boolean' }],
    ["then", { inputValue: 'THEN', shadow: 'io_logic_boolean' }],
    ["else", { inputValue: 'ELSE', shadow: 'io_logic_boolean' }],
  ],

  generators: {
    json: (block, generator) => {
      const
        ifLogic = generator.valueToCode(block, 'IF', 0),
        thenLogic = generator.valueToCode(block, 'THEN', 0),
        elseLogic = generator.valueToCode(block, 'ELSE', 0),
        blockPayload = JSON.stringify({
          conditional: {
            ifThens: [
              { if: ifLogic ? JSON.parse(ifLogic) : null,
                then: thenLogic ? JSON.parse(thenLogic) : null }
            ],
            else: elseLogic ? JSON.parse(elseLogic) : null
          }
        })

      return [blockPayload, 0]
    }
  }
}
