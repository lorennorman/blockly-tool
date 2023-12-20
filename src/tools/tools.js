import { forEach, includes, isObject, isString, keys, map, reduce, values, without } from 'lodash-es'

export const toBlockJSON = block => {
  const json = {
    type: block.type,
    ...block.help,
    ...block.visualization,
    ...processConnections(block),
    ...processLines(block),
  }

  return json
}

// mode: "none" || "value" || "statement:first" || "statement:last" || "statement",
// output: "type" || ["list", "of", "types"],
// next: "type" || ["list", "of", "types"]
const processConnections = block => {
  const processEmpty = () => {
    if(output) {
      console.warn(`connections: "mode" is empty, no "output" expected, got: "${output}"`)
    }

    if(next) {
      console.warn(`connections: "mode" is empty, no "next" expected, got: "${next}"`)
    }
  }

  const processValue = () => {
    if(next) {
      console.warn(`connections: "mode" is "value", no "next" expected, got: "${next}"`)
    }

    return { output }
  }

  const processStatement = () => {
    const object = {}

    if(next && mode === 'statement:last') {
      console.warn(`connections: "mode" is "statement:last", no "next" expected, got: "${next}"`)
    }

    if(output && mode === 'statement:first') {
      console.warn(`connections: "mode" is "statement:first", no "output" expected, got: "${output}"`)
    }

    if(next && (mode === 'statement' || mode === 'statement:first')) {
      object.nextStatement = next
    }

    if(output &&(mode === 'statement' || mode === 'statement:last')) {
      object.previousStatement = output
    }

    return object
  }

  const { mode, output, next } = block.connections || {}

  switch(mode) {
    case null:
    case undefined:
    case 'none':
      return processEmpty()

    case 'value':
      return processValue()

    case 'statement:first':
    case 'statement':
    case 'statement:last':
      return processStatement()

    default:
      throw new Error(`Invalid value for connections.mode: "${mode}"`)
  }
}

const processLines = block => {
  // grab block settings
  // process each line
  const { lines, input } = block
  return reduce(lines, (allLines, line, lineNumber) => {
    const { message, args } = processLine(line, input)
    allLines[`message${lineNumber}`] = message
    allLines[`args${lineNumber}`] = args
    return allLines
  }, {})
}

const processLine = (line, inputValues={}) => {
  if(!isString(line) && !isObject(line)) {
    throw new Error(`Given non-object, non-string line: ${line}`)
  }

  const { alignment, lineValue } = splitAlignment(line)

  // expect 'text' key
  if(!isString(lineValue.text)) { throw new Error(`No text given for line: ${JSON.stringify(line, null, 2)}`)}
  // expect optional 'input' key
  // expect no other keys
  const otherKeys = without(keys(lineValue), 'text', 'input')
  if(otherKeys.length) { throw new Error(`Expected no keys other than "text" and "input", got:\n${otherKeys}\nfor line: ${JSON.stringify(line, null, 2)}`)}

  const args = []
  let message = lineValue.text

  // process alignment and input into args
  if(lineValue.input) {
    // lookup in values, fields, statements
    // TODO: ensure only one found
    const fieldInput = inputValues.fields?.[lineValue.input]
    if(fieldInput) {
      args.push({
        type: (fieldInput.options && "field_dropdown")
          || (includes(keys(fieldInput), "checked") && "field_checkbox"),
        name: lineValue.input,
        check: fieldInput.check,
        options: fieldInput.options
      })
    }
    const valueInput = inputValues.values?.[lineValue.input]
    if(valueInput) {
      args.push({
        type: "input_value",
        name: lineValue.input,
        check: valueInput.check
      })
    }
    const statementInput = inputValues.statements?.[lineValue.input]
    if(statementInput){
      throw new Error(`Not implemented: statement inputs`)
    }
  }

  if(alignment) {
    if(args.length) {
      args[0].align = alignment.toUpperCase()
    } else {
      args.push({
        "type": "input_dummy",
        "align": alignment.toUpperCase()
      })
    }
  }

  // process text into message
  if(args.length === 1) {
    message = message.concat(" %1")
  } else if(args.length === 2) {
    message = message.concat(" %1 %2")
  }

  return { args, message }
}

const validAlignments = ['center', 'centre', 'right', 'left']
const splitAlignment = line => {
  if(isString(line)) {
    return { alignment: undefined, lineValue: { text: line } }
  }

  // look for alignment keys
  const lineKeys = keys(line)
  let alignment
  forEach(lineKeys, key => {
    const lowerKey = key?.toLowerCase()
    if(includes(validAlignments, lowerKey)) {
      alignment = (lowerKey === 'center') ? 'centre' : lowerKey

      if(lineKeys.length > 1) {
        const lineKeysMessage = without(lineKeys, key).join('", "')
        throw new Error(`Alignment key ("${key}") should not have sibling keys, but has:\n"${lineKeysMessage}"`)
      }
    }
  })

  const lineValue = alignment
    ? values(line)[0]
    : line

  // if found, alignment must be only key
  return  {
    alignment,
    lineValue: isString(lineValue)
      ? { text: lineValue }
      : lineValue
  }
}
