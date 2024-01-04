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
    colour: 230
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

  // specify all data this block contains
  data: {
    // inline form elements
    fields: {
      // 'options' key makes a dropdown
      FIELD_A: { options: [
        [ 'user sees', 'internal id' ], // n times
      ]},
      // 'checked' key makes a checkbox
      FIELD_B: { checked: true }
    },

    // single block attachments
    inputValues: {
      INPUT_A: {
        check: 'other_block_output', // validate connected block is this type
        shadow: 'other_block_type' // generate this kind of shadow from toolbox
      },
      FEED_B: {
        check: [ "other", "block", "outputs" ], // validate connected block is in this collection of types
        shadow: 'other_block_type'
      },
    },

    // list of block attachments (not implemented yet)
    inputStatements: {}
  },

  // describes each line of the block, from top to bottom
  lines: [
    "line contents", // bare string: simple text line,

    // ARRAY LINES
    // 2 strings: text with alignment
    [ "line contents", "alignment" ],
    // string and object: text with inputValue or fields
    [ "line contents", {
      // if it's a single block input
      inputValue: 'INPUT_NAME',
      check: 'input_block_output',
      shadow: 'block_type_to_shadow', //
      shadow: {
        type: 'block_type_to_shadow',
        inputs: "set shadow inputs",
        fields: "set shadow fields"
      },
      // TODO: inputStatement
      // if it's a single field input
      field: 'FIELD_NAME',
      text: 'whatever', // makes a text field
      spellcheck: true, // text field option
      checked: true, // makes a checkbox field
      options: [ // makes a dropdown field
        ['user text', 'computer id'],
        // ...
      ],
      // TODO: multiple fields: {}
    }],

    // OBJECT LINES (moving away from this)
    { // bare object:
      // - text is line text
      // - input refers to any input collection key
      text: 'line contents with input appended',
      input: 'INPUT_A',
    },
    // alignment key: creates an input dummy for alignment
    { center: "centered text" }, // bare string value: becomes line text
    { right: { // object value: text with input options
        text: 'right-aligned text with an input appended',
        input: 'INPUT_B',
    }}
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
