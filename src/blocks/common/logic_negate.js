export default {
  type: 'logic_negate',

  toolbox: {
    category: 'Logic',
  },

  generators: {
    json: (block, generator) => {
      const
        booleanLogic = generator.valueToCode(block, 'BOOL', 0),
        negatedLogic = generator.prefixLines(`"not": ${booleanLogic}`, generator.INDENT),
        blockPayload = booleanLogic
          ? `{\n${negatedLogic}\n}`
          : '{ "not": null }'

      return [blockPayload, 0]
    }
  }
}
