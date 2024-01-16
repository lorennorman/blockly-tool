export default {
  type: "schedule_hourly",

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 208,
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
      shadow: {
        type: 'selector_hours',
        fields: {
          HOUR_END: "23"
        }
      }
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        minutes = parseInt(generator.valueToCode(block, 'MINUTE', 0), 10),
        hours = generator.valueToCode(block, 'HOURS', 0),
        crontab = frequency === 'once'
          ? `${minutes} ${hours} * * *`
          : `${minutes%30}/30 ${hours} * * *`

      return [ crontab , 0 ]
    }
  }
}
