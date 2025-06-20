import { capitalize, filter, isArray, isObject, isString, map } from 'lodash-es'


const
  getLineObjects = definition => filter(map(filter(definition.lines, isArray), "[1]"), isObject),

  renderInputs = definition => {
    const
      lineObjs = getLineObjects(definition),
      inputObjects = filter(lineObjs, line => line.inputValue || line.inputStatement),
      renderedInputs = inputObjects.map(renderInput).join("\n\n")

    return renderedInputs
  },

  renderInput = input => {
    const
      inputName = input.inputValue || input.inputStatement,
      lines = []

    lines.push(`### \`${ capitalize(inputName) }\``)

    Object.hasOwn(input, 'check') && lines.push(renderInputCheck(input))

    return lines.join("\n\n")
  },

  renderInputCheck = inputChecked => {
    return `Restricts inputs to \`${inputChecked.check}\``
  }


export default renderInputs
