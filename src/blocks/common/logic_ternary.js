export default {
  type: 'logic_ternary',

  toolbox: {
    category: 'Logic',
  },

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
