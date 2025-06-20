import { capitalize, filter, isArray, isObject, isString, map } from 'lodash-es'


const
  getLineObjects = definition => filter(map(filter(definition.lines, isArray), "[1]"), isObject),

  renderFields = definition => {
    const fields = filter(getLineObjects(definition), "field")

    if(!fields.length) { return "This block has no form fields." }

    return fields.map(renderField).join("\n\n")
  },

  renderField = field => {
    const lines = []

    // title for this field
    lines.push(`### Field: \`${capitalize(field.field)}\``)

    // add lines based on what properties are present
    Object.hasOwn(field, 'text') && lines.push(renderTextField(field))
    Object.hasOwn(field, 'checked') && lines.push(renderCheckboxField(field))
    Object.hasOwn(field, 'options') && lines.push(renderSelectField(field))

    return lines.join("\n\n")
  },

  renderTextField = textField => `Default: "${textField.text}"`,

  renderCheckboxField = checkboxField => `- Boolean (default: ${checkboxField.checked})`,

  renderSelectField = selectField => {
    const
      optionLabels = map(selectField.options, 0),
      optionList = map(optionLabels, label => `  - ${label}`).join("\n")

    return `- Options:\n${optionList}`
  }


export default renderFields
