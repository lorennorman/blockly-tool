import { capitalize, filter, forEach, isArray, isObject, keys, map } from 'lodash-es'


const
  renderInputs = definition => {
    // TODO: legacy api, remove when blocks no longer use
    if(definition.lines) {
      return renderLineInputs(definition)
    }

    if(!keys(definition.inputs).length) {
      return "This block has no inputs"
    }

    const lines = []
    forEach(definition.inputs, (input, inputName) => {
      if(input.type === 'label') { return }

      lines.push(`### \`${ capitalize(inputName) }\``)
      lines.push(input.description)
    })

    return lines.join("\n\n")
  },

  renderLineInputs = definition => {
    const
      lineObjs = filter(map(filter(definition.lines, isArray), "[1]"), isObject),
      inputObjects = filter(lineObjs, line => line.inputValue || line.inputStatement),
      renderedInputs = inputObjects.map(renderLineInput).join("\n\n")

    return renderedInputs
  },

  renderLineInput = input => {
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
