import { flatMap, forEach, includes, isArray, isObject, isString, keys, reduce, values, without } from 'lodash-es'

import { defaultAlignment } from '../blocks/defaults.js'

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
  const { lines } = block
  return reduce(lines, (allLines, line, lineNumber) => {
    const { message, args } = processLine(line)
    allLines[`message${lineNumber}`] = message
    allLines[`args${lineNumber}`] = args
    return allLines
  }, {})
}

const processLine = (line) => {
  if(!isString(line) && !isObject(line)) {
    throw new Error(`Given non-object, non-string line: ${line}`)
  }

  const { alignment, lineValue, lineData={} } = parseLine(line)

  // always expect alignment
  if(!alignment) { throw new Error(`Alignment not detected for line: ${JSON.stringify(line, null, 2)}`) }
  // expect 'text' key
  if(!isString(lineValue.text)) { throw new Error(`No text given for line: ${JSON.stringify(line, null, 2)}`)}
  // expect optional 'input' key
  const otherKeys = without(keys(lineValue), 'text', 'input')
  // expect no other keys
  if(otherKeys.length) { throw new Error(`Expected no keys other than "text" and "input", got:\n${otherKeys}\nfor line: ${JSON.stringify(line, null, 2)}`)}

  // build up the args
  const args = []

  // append inputValues to args
  if(lineData.inputValue) {
    args.push({
      type: "input_value",
      name: lineData.inputValue,
      check: lineData.check
    })

  // append fields to args
  } else if(lineData.field) {
    args.push({
      type: (lineData.options && "field_dropdown")
        || (includes(keys(lineData), "checked") && "field_checkbox")
        || (includes(keys(lineData), "text") && "field_input"),
      name: lineData.field,
      checked: lineData.checked,
      options: lineData.options,
      text: lineData.text,
      spellcheck: lineData.spellcheck,
    })
  }

  // if an input exists, append alignment to it
  if(args[0]?.type === "input_value") {
    args[0].align = alignment

  // otherwise make an input for alignment
  } else {
    args.push({
      "type": "input_dummy",
      "align": alignment
    })
  }

  // quick sanity check on args length
  if(args.length > 2) {
    throw new Error(`args array longer than 2: ${JSON.stringify(args, null, 2)}`)
  }

  // process text into message
  const
    argsIndices = (args.length === 1) ? " %1"
      : (args.length === 2) ? " %1 %2"
      : '',
    message = lineValue.text.concat(argsIndices)

  return { args, message }
}

const parseLine = line => {
  if(isString(line)) { return parseStringLine(line) }

  if(isArray(line)) { return parseArrayLine(line) }

  throw new Error(`Line not valid: ${JSON.stringify(line, null, 2)}`)
}

const parseStringLine = text =>
 ({ alignment: defaultAlignment, lineValue: { text } })

const parseArrayLine = line => {
  const [ text, second ] = line

  if(isString(second)) {
    const alignment = parseAlignment(second)
    return { alignment, lineValue: { text } }
  }

  if(isObject(second)) {
    const alignment = parseAlignment(second.align)
    return { alignment, lineValue: { text }, lineData: second }
  }

  throw new Error(`second index invalid for line: ${JSON.stringify(line, null, 2)}`)
}

const validAlignments = [ 'CENTER', 'CENTRE', 'RIGHT', 'LEFT' ]
const parseAlignment = alignmentString => {
  // if the input is falsy, return default alignment
  if( !alignmentString ) { return defaultAlignment }

  alignmentString = alignmentString.toUpperCase()
  // throw if the downcased string is not in the valid list
  if( !includes(validAlignments, alignmentString) ) {
    throw new Error(`Alignment not valid: ${alignmentString}`)
  }

  // anglocize and return
  return alignmentString === 'CENTER'
    ? 'CENTRE'
    : alignmentString
}


// TODO: re-use this when we want to do inline fields like:
//   "Field 1: %FIELD_NAME_1 more text then %FIELD_NAME_2 fields not at end"
const DATA_REGEX = / %\w+/ // a space, then %, then one or more word characters
const lineToMessageAndInput = ({ text, input }, dataKeys) => {
  // check if this text contains a data string
  const replacementString = text.match(DATA_REGEX)?.[0]

  if(text && input) {
    if(replacementString) {
      // should send an input and a data string
      throw new Error(`Received text with a datastring and an input, use one or the other!\ntext: "${text}"\ninput: "${input}")`)
    }

    return { message: text, inputKey: input }
  }

  let
    inputKey,
    message = text

  if(replacementString) {
    // insert an inputKey for it
    inputKey = replacementString.slice(2)
    // look up the data entry

    if(!includes(dataKeys, inputKey)) {
      throw new Error(`Data input not found: ${inputKey}`)
    }
    // remove it from the text
    message = message.replace(replacementString, '')
  }

  return { message, inputKey }
}
