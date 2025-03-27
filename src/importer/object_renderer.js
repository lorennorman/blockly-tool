import { forOwn, keys, isString, isFunction, isArray, isNumber, isNull, isObject, map, isRegExp, sortBy } from 'lodash-es'


const
  TAB = "  ",
  STARTS_WITH_NUM = /^[0-9]/,
  CONTAINS_NON_ALPHANUM = /[^a-zA-Z0-9_]+/

const quotedKey = key =>
  STARTS_WITH_NUM.test(key) || CONTAINS_NON_ALPHANUM.test(key)
    ? `"${key}"`
    : key

const renderValue = (value, tab=TAB) => {
  if (isString(value)) {
    return `"${value}"`

  } else if (isRegExp(value) || isNull(value) || isNumber(value) || value === false) {
    return value

  } else if (isFunction(value)) {
    return renderFunction(value, tab)

  } else if (isArray(value)) {
    return `[ ${value.map(i => renderValue(i, tab+TAB)).join(", ")} ]`

  } else if (isObject(value)) {
    const lines = []
    forOwn(value, (val, key) => {
      lines.push(`${tab}${quotedKey(key)}: ${renderValue(val, tab+TAB)}`)
    })
    return `{\n${lines.join(",\n\n")}\n${tab.slice(-TAB.length)}}`

  } else {
    // TODO: what to really do here? maybe caller passes a strategy for missing values
    return '{}'
    // throw new Error(`Unexpected value type: ${value}`)
  }
}

const renderFunction = (func, indentation=TAB) => {
  const
    functionString = func.toString(),
    // capture whitespace after first newline
    match = /\n\s*/.exec(functionString)?.[0].slice(1)

  // early out if no newlines in function
  if(!match) { return functionString }

  const reIndentedFunction = functionString
    // regex replace \n[measured whitespace] \n[indentation]
    .replaceAll(`\n${match}`, `\n${indentation}`)
    // replace last line with 2 less indentation and a closing bracket
    .replace(/\n.*$/, `\n${indentation.slice(0, -2)}}`)

  return reIndentedFunction
}

const renderObject = object => {
  const
    sortedKeys = sortBy(keys(object)),
    sortedKeyValues = map(sortedKeys, key => `${quotedKey(key)}: ${renderValue(object[key], TAB+TAB)}`)

  return [
    '{',
    `${TAB}${sortedKeyValues.join(`,\n\n${TAB}`)}`,
    '}'
  ].join("\n")
}

export default renderObject
