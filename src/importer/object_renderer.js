import { forOwn, isString, isFunction, isArray, isNumber, isNull, isObject, map, isRegExp } from 'lodash-es'


const TAB = "  "

const renderValue = (value, tab=TAB) => {
  if (isString(value)) {
    return `"${value}"`

  } else if (isRegExp(value) || isNull(value) || isNumber(value) || value === false) {
    return value

  } else if (isFunction(value)) {
    return value.toString().replaceAll("\n", "\n  ")

  } else if (isArray(value)) {
    return `[ ${value.map(i => renderValue(i, tab+TAB)).join(", ")} ]`

  } else if (isObject(value)) {
    const lines = []
    forOwn(value, (val, key) => {
      lines.push(`${tab}${key}: ${renderValue(val, tab+TAB)}`)
    })
    return `{\n${lines.join(",\n")}\n${tab.slice(-TAB.length)}}`

  } else {
    throw new Error(`Unexpected value type: ${value}`)
  }
}

const renderObject = object => {
  return `{\n${TAB}${map(object, (value, key) => `${key}: ${renderValue(value, TAB+TAB)}`).join(',\n\n  ')}\n}`
}

export default renderObject
