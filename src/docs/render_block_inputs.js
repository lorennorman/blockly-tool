import { capitalize, forEach, keys } from 'lodash-es'


const
  renderInputs = definition => {
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
  }


export default renderInputs
