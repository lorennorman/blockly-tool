export default {
  type: 'controls_if',

  toolbox: {
    category: 'Logic',
  },

  generators: {
    json: (block, generator) => {
      // If/elseif/else condition.
      const conditionals = [ ]

      // loop through the if/else ifs
      let n = 0
      do {
        const
          conditionalLines = [],
          conditionCode = generator.valueToCode(block, 'IF' + n, 0) || 'false',
          branchCode = generator.statementToCode(block, 'DO' + n)

        conditionalLines.push(`"if": ${conditionCode},`)
        conditionalLines.push(`"then": [\n${branchCode}\n]`)

        conditionals.push(generator.prefixLines("{\n"+generator.prefixLines(conditionalLines.join('\n'), generator.INDENT)+"\n}", generator.INDENT))
        n++
      } while (block.getInput('IF' + n))

      const
        elseInput = block.getInput('ELSE'),
        lines = [
          `"conditional": {`,
          `"ifThens": [`,
          conditionals.join(',\n'),
          `]${elseInput ? ',' : ''}`,
        ]

      if(elseInput) {
        const branchCode = generator.statementToCode(block, 'ELSE')

        lines.push(`"else": [\n${branchCode}\n]`)
      }

      lines.push('}')
      const indentedLines = generator.prefixLines(lines.join('\n'), generator.INDENT)

      return `{\n${indentedLines}\n}`
    }
  }
}
