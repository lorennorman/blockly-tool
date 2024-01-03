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
  const { lines, data } = block
  return reduce(lines, (allLines, line, lineNumber) => {
    const { message, args } = processLine(line, data)
    allLines[`message${lineNumber}`] = message
    allLines[`args${lineNumber}`] = args
    return allLines
  }, {})
}

const processLine = (line, data={}) => {
  if(!isString(line) && !isObject(line)) {
    throw new Error(`Given non-object, non-string line: ${line}`)
  }

  const { alignment, lineValue, lineData } = splitAlignment(line)

  // expect 'text' key
  if(!isString(lineValue.text)) { throw new Error(`No text given for line: ${JSON.stringify(line, null, 2)}`)}
  // expect optional 'input' key
  const otherKeys = without(keys(lineValue), 'text', 'input')
  // expect no other keys
  if(otherKeys.length) { throw new Error(`Expected no keys other than "text" and "input", got:\n${otherKeys}\nfor line: ${JSON.stringify(line, null, 2)}`)}

  const args = []
  let message = ''

  if(lineData) {
    message = lineValue.text
    // check for inputValue or field keys
    if(lineData.inputValue) {
      args.push({
        type: "input_value",
        name: lineData.inputValue,
        check: lineData.check
      })

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

    } else {
      throw new Error(`No data type in data parameter: ${JSON.stringify(lineData, null, 2)}`)
    }

  } else {
    const
      allDataKeys = flatMap([ keys(data.fields), keys(data.inputValues), keys(data.inputStatements)]),
      messageAndInput = lineToMessageAndInput(lineValue, allDataKeys),
      { inputKey } = messageAndInput

    message = messageAndInput.message


    // process alignment and input into args
    if(inputKey) {
      // lookup in values, fields, statements
      // TODO: ensure only one found
      const fieldInput = data.fields?.[inputKey]
      if(fieldInput) {
        args.push({
          type: (fieldInput.options && "field_dropdown")
            || (includes(keys(fieldInput), "checked") && "field_checkbox"),
          name: inputKey,
          check: fieldInput.check,
          options: fieldInput.options
        })
      }
      const valueInput = data.inputValues?.[inputKey]
      if(valueInput) {
        args.push({
          type: "input_value",
          name: inputKey,
          check: valueInput.check
        })
      }
      const statementInput = data.inputStatements?.[inputKey]
      if(statementInput){
        throw new Error(`Not implemented: statement inputs`)
      }
    }
  }

  if(alignment) {
    // append alignment to an existing input
    if(args[0]?.type === "input_value") {
      args[0].align = alignment.toUpperCase()

    // make an input just for alignment
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
    return { alignment: defaultAlignment, lineValue: { text: line } }
  }

  if(isArray(line)) {
    return parseArrayLine(line)
  }

  if(isObject(line)) {
    return parseObjectLine(line)
  }

  throw new Error(`Line not valid: ${JSON.stringify(line, null, 2)}`)
}

const parseArrayLine = line => {
  const [ text, second ] = line

  if(isString(second)) {
    return { alignment: second, lineValue: { text } }
  }

  if(isObject(second)) {
    const alignment = second.align || defaultAlignment
    return { alignment, lineValue: { text }, lineData: second }
  }

  throw new Error(`second index invalid for line: ${JSON.stringify(line, null, 2)}`)
}

const parseObjectLine = line => {
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
    alignment: alignment || defaultAlignment,
    lineValue: isString(lineValue)
      ? { text: lineValue }
      : lineValue
  }
}

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
