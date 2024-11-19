export default {
  type: "delay_settings",

  // same as Blockly JSON
  visualization: {
    colour: '0',
    tooltip: [
      "Causes a delay between this Action's trigger and its execution",
      "---------------",
      "Parameters:",
      "Delay - how long to delay, from 1 second to 1 day",
      "Mode - how to proceed if another action is already on delay.",
      "...'keep' will keep the existing delay and ignore new triggers",
      "...'reset' will delete the existing delay and start a new one",
    ].join('\n'),
  },

  connections: { },

  lines: [
    ["Delay Settings", "CENTER"],
    ["Delay:", {
      // for a single block input
      inputValue: 'DELAY_PERIOD',
      check: 'delay_period',
      shadow: { type: 'delay_seconds', fields: { SECONDS: '5' } },
    }],

    ["and", {
      field: 'DELAY_MODE',
      options: [
        ['reset', 'extend'],
        ['keep', 'static'],
      ],
    }],

    "existing delays"
  ],

  // generators for this block type
  // these get aggregated and registered together
  generators: {
    json: (block, generator) => {
      // fetch connected block: block.getInputTargetBlock('INPUT_VALUE_NAME')?.type,
      // generate connected block: generator.valueToCode(block, 'INPUT_VALUE_NAME', 0)
      // field value: block.getFieldValue('FIELD_NAME')

      return [ {}, 0 ]
    }
  }
}
