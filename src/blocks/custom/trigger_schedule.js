export default {
  type: "trigger_schedule",

  toolbox: {
    category: 'Triggers',
    label: "Fire on a given schedule, from hourly up to once a year."
  },

  visualization: {
    colour: 120,
    tooltip: [
      "Fires the action on a SCHEDULE. Select an appropriate block from the 'Schedules' category to configure.",
      "---------------",
      "Parameters:",
      "SCHEDULE - a Schedule block for hourly, daily, weekly, monthly, or annually"
    ].join('\n')
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
