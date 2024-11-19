export default {
  type: "delay_settings",

  // same as Blockly JSON
  visualization: {
    colour: '0',
    tooltip: "Delay this action for a period of time after its trigger fires?",
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
