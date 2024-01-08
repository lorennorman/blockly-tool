export default {
  type: "trigger_schedule",

  toolbox: {
    category: 'Triggers'
  },

  visualization: {
    "colour": 230,
  },

  connections: {
    mode: 'value',
    output: 'trigger'
  },

  lines: [
    [ "📅 Scheduled", 'CENTER' ],

    [ "When:", {
      inputValue: 'SCHEDULE',
      check: 'schedule'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        payload = {
          trigger_type: 'schedule',
          value: generator.valueToCode(block, 'SCHEDULE', 0) || null
        }

      return [ payload, 0 ]
    }
  }
}
