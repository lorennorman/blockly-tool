import { includes, isArray, isObject, isString, keys, map, range, reduce, without } from 'lodash-es'


const defaultAlignment = "RIGHT"

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
  if(lineData.inputDummy) {
    args.push({
      type: "input_dummy",
      name: lineData.inputDummy,
      check: lineData.check
    })

  // append inputValue
  } else if(lineData.inputValue) {
    args.push({
      type: "input_value",
      name: lineData.inputValue,
      check: lineData.check
    })

  // append inputStatement
  } else if(lineData.inputStatement) {
    args.push({
      type: "input_statement",
      name: lineData.inputStatement,
      check: lineData.check
    })

  // append a field to args
  } else if(lineData.field) {
    args.push({
      name: lineData.field,
      type: (lineData.options && "field_dropdown")
        || (includes(keys(lineData), "checked") && "field_checkbox")
        || (includes(keys(lineData), "text") && "field_input")
        || (includes(keys(lineData), "multiline_text") && "field_multilinetext")
        || lineData.type,
      checked: lineData.checked,
      options: lineData.options,
      text: lineData.text || lineData.multiline_text || "",
      spellcheck: lineData.spellcheck,
      value: lineData.value,
    })

  // append multiple fields to args
  } else if(lineData.fields) {
    args.push(...map(lineData.fields, (fieldData, fieldName) => ({
      name: fieldName,
      type: (fieldData.options && "field_dropdown")
        || (includes(keys(fieldData), "checked") && "field_checkbox")
        || (includes(keys(fieldData), "text") && "field_input")
        || (includes(keys(fieldData), "multiline_text") && "field_multilinetext")
        || fieldData.type,
      checked: fieldData.checked,
      options: fieldData.options,
      text: fieldData.text,
      spellcheck: fieldData.spellcheck,
      value: fieldData.value,
    })))
  }

  // if an input exists, append alignment to it
  if(includes(['input_value', 'input_statement', 'input_dummy'], args[0]?.type)) {
    args[0].align = alignment

  // otherwise make an input for alignment
  } else {
    args.push({
      type: "input_dummy",
      align: alignment
    })
  }

  // process template text into message
  // walk the args and make sure the message refers to them
  const message = reduce(range(1, args.length+1), (acc, idx) => {
    // what this arg needs to be represented by in the text
    const idxToken = `%${idx}` // %1, %2, etc...
    // already there? move along
    if(acc.includes(idxToken)) { return acc }

    // is the arg present in magic format? (%ARG_NAME)
    const
      argName = args[idx-1].name,
      argToken = `%${argName}`

    if(acc.includes(argToken)) {
      // replace it with the real token
      return acc.replace(argToken, idxToken)
    }

    // otherwise simply append to the end
    return `${acc} ${idxToken}`
  }, lineValue.text)


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
    const extraKeys = without(keys(second), "align", "inputDummy", "inputValue", "inputStatement", "check", "block", "field", "fields", "type", "text", "multiline_text", "options", "shadow", "checked")
    if(extraKeys.length) {
      throw new Error(`Unrecognized keys (${extraKeys.join(', ')}) for block line with text: "${text}"`)
    }
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

export default processLines
