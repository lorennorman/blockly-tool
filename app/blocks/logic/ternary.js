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
        ifLogic = generator.valueToCode(block, 'IF', 0) || null,
        thenLogic = generator.valueToCode(block, 'THEN', 0) || null,
        elseLogic = generator.valueToCode(block, 'ELSE', 0) || null,
        blockPayload = JSON.stringify({
          conditional: {
            if0: JSON.parse(ifLogic),
            then0: JSON.parse(thenLogic),
            else: JSON.parse(elseLogic)
          }
        })

      return [blockPayload, 0]
    }
  }
}
