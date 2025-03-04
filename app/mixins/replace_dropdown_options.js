export const replaceDropdownOptions = function(fieldKey, newOptions) {
  const oldValue = this.getFieldValue(fieldKey)

  // search this block's inputs...
  let input, foundFieldAt
  for (let i = 0; i < this.inputList.length;i++) {
    input = this.inputList[i]

    // ...and the input's fields...
    for (let j = 0; j < input.fieldRow.length;j++) {
      // ...for a field with the right name...
      if(input.fieldRow[j].name == fieldKey) {
        // ...and record its index
        foundFieldAt = j
        break
      }
    }

    // stop iterating inputs when field is found
    if(foundFieldAt) { break }
  }

  if(!foundFieldAt) {
    console.error(`[mixins.relaceDropdownOptions] No field named "${fieldKey}" found in ${this.type} block.`)
    return
  }

  const newField = new Blockly.FieldDropdown(newOptions)

  // maintain previous value, if present
  if(oldValue) {
    newField.setValue(oldValue)
  }

  input.removeField(fieldKey)
  input.insertFieldAt(foundFieldAt, newField, fieldKey)
}

export default {
  replaceDropdownOptions
}
