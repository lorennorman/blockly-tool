
export const
  toolbox = {
    category: 'Triggers'
  },

  json = {
    type: "trigger_on_change",
    message0: "Feed Check: %1 Reactive? %2",
    args0: [
      {
        type: "input_value",
        name: "FEED_CHECK"
      },
      {
        type: "field_checkbox",
        name: "REACTIVE",
        checked: true
      }
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: "Plug in a Feed, or Logic that references a Feed.",
    helpUrl: ""
  },

  generators = {
    json: (block, generator) => {
      var value_feed_check = generator.valueToCode(block, 'FEED_CHECK', 0);
      var checkbox_reactive = block.getFieldValue('REACTIVE') === 'TRUE';
      // TODO: Assemble javascript into code variable.
      var code = '...\n';
      return code;
    },

    markdown: (block, generator) => {
      return 'markity'
    }
  }