export default {
  type: "schedule_hourly",

  toolbox: {
    category: 'Schedules',
    helpText: "Once or twice hourly, every S hours between B and E, at minute M."
  },

  visualization: {
    colour: 208,
    tooltip: [
      "Trigger the action once or twice an hour.",
      "- once: the action will fire on the minute specified.",
      "- twice: the action will fire on the minute specified, as well as at +/-30 minutes.",
    ].join('\n')
  },

  connections: {
    mode: "value",
    output: "schedule"
  },

  lines: [
    [ "Hourly", "LEFT" ],

    [ "", {
      field: "FREQUENCY",
      options: [
        [ "Once", "once" ],
        [ "Twice", "twice" ],
      ]
    }],

    [ "...at:", {
      inputValue: 'MINUTE',
      check: 'cron_minute',
      shadow: 'selector_minute'
    }],

    [ "...every:", {
      inputValue: 'HOURS',
      check: 'cron_hours_range',
      shadow: 'selector_hours'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        minutes = parseInt(generator.valueToCode(block, 'MINUTE', 0), 10),
        cronMinutes = frequency === 'once'
          ? minutes
          : `${minutes%30}/30`,
        cronHours = generator.valueToCode(block, 'HOURS', 0)

      return [ `${cronMinutes} ${cronHours} * * *` , 0 ]
    }
  }
}
