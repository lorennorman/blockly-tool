export default {
  type: "schedule_hourly",

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 232,
  },

  connections: {
    mode: "value",
    output: "schedule"
  },

  lines: [
    [ "Hourly", "LEFT" ],

    [ "%1 an hour", {
      field: "FREQUENCY",
      options: [
        [ "Once", "once" ],
        [ "Twice", "twice" ],
      ]
    }],

    [ "...at minute:", {
      inputValue: 'MINUTE',
      check: 'cron_minute',
      shadow: 'selector_minute'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        minutes = generator.valueToCode(block, 'MINUTE', 0),
        crontab = frequency === 'once'
          ? `${minutes} * * * *`
          : `${minutes%30}/30 * * * *`

      return [ crontab , 0 ]
    }
  }
}
