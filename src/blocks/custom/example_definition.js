export default {
  // required, unique
  // identifier for this block, used all over Blockly
  type: "block_type",

  // determines where the block shows up in the toolbox
  toolbox: {
    // category must match a category in the toolbox config
    category: 'Category Name'
  },

  // same as Blockly JSON
  help: {
    tooltip: "",
    helpUrl: ""
  },

  // same as Blockly JSON
  visualization: {
    inputsInline: false,
    colour: 100
  },

  // TODO: consider something simpler, maybe leftOutput, topOutput, and bottomCheck?
  // Block connections
  connections: {
    // mode options:
    // - falsy or "none": no connections
    // - "value": has a side input, "output" maps to "output"
    // - statements
    //   - "statement": top and bottom connections, "output" maps to "previousStatement", "next" maps to "nextStatement"
    //   - "statement:first": bottom connection, "output" invalid, "next" maps to "nextStatement"
    //   - "statement:last": top connection, "output" maps to "previousStatement", "next" invalid
    mode: "value",
    output: "trigger",
  },

  // describes each line of the block, from top to bottom
  lines: [
    // STRING LINES
    "line contents", // simple text line, default alignment,

    // ARRAY LINES
    // [ string, string ]: [ text, alignment ]
    [ "line contents", "alignment" ],

    // [ string, object ]: [ text, { inputValue, inputStatement, field, fields } ]
    [ "line contents", {
      // for a single block input
      inputValue: 'INPUT_VALUE_NAME',
      check: 'input_block_output',
      shadow: 'block_type_to_shadow', // -> { shadow: { type: 'block_type_to_shadow' }}
      shadow: {
        type: 'block_type_to_shadow',
        inputs: {}, // fill in the inputs on the shadowed block
        fields: {}, // fill in the fields on the shadowed block
      },

      // TODO: for multiple block inputs
      // inputStatement: 'INPUT_STATEMENT_NAME', ...

      // for a single field input
      field: 'FIELD_NAME',
      text: 'whatever', // makes a text field
      spellcheck: true, // text field option
      checked: true, // makes a checkbox field
      options: [ // makes a dropdown field
        ['user text', 'computer id'],
        // ...
      ],

      // TODO: for multiple field inputs: {}
    }],
  ],

  // generators for this block type
  // these get aggregated and registered together
  generators: {
    json: (block, generator) => {
      // fetch connected block: block.getInputTargetBlock('INPUT_A')?.type,
      // generate connected block: generator.valueToCode(block, 'INPUT_B', 0)
      // field value: block.getFieldValue('FIELD_A')

      return [ {}, 0 ]
    }
  }
}
