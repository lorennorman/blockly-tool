// Populates Feed dropdowns with name FEED_KEY to contain the user's feeds
// that are viable for Actions. Provided by the backend at runtime.
export const populateFeedDropdown = ({ block, data, Blockly }) => {
  const
    { feedOptions } = data,
    FIELD_KEY = "FEED_KEY"

  if(!feedOptions) {
    console.error(`[extensions.populateFeedDropdown] No feedOptions found in extension data.`)
    return
  }

  // search this block's inputs...
  let input, foundFieldAt
  for (let i = 0; i < block.inputList.length;i++) {
    input = block.inputList[i]

    // ...and the input's fields...
    for (let j = 0; j < input.fieldRow.length;j++) {
      // ...for a field with the right name...
      if(input.fieldRow[j].name == FIELD_KEY) {
        // ...and record its index
        foundFieldAt = j
        break
      }
    }

    // stop iterating inputs when field is found
    if(foundFieldAt) { break }
  }

  if(!foundFieldAt) {
    console.error(`[extensions.populateFeedDropdown] No field named "${FIELD_KEY}" found in ${block.type} block.`)
    return
  }

  input.removeField(FIELD_KEY)
  input.insertFieldAt(foundFieldAt, new Blockly.FieldDropdown(feedOptions), FIELD_KEY)
}

// also export as default
export default populateFeedDropdown
