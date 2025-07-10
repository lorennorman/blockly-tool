import { map } from 'lodash-es'


export const
  niceTemplate = tplString => {
    const
      lines = tplString.split("\n"),
      firstLineBlank = /^\s*$/.test(lines[0]),
      remainingLines = lines.slice(1, -1),
      indentCounts = map(remainingLines, line => line.search(/\S/)),
      firstLineLeastIndented = indentCounts[0] >= Math.min(...indentCounts.slice(1, -1))

    // ensure first line is blank and every other line has at least as much whitespace as the first line
    if(firstLineBlank && firstLineLeastIndented) {
      // drop the first line, remove X whitespace chars from the rest and join with newline
      return map(remainingLines, line => line.slice(indentCounts[0])).join("\n")
    }

    // TODO: support niceties for markdown, double-newlines, escaping, etc

    return tplString
  }
