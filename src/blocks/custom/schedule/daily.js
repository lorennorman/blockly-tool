export default {
  type: "schedule_daily",

  toolbox: {
    category: 'Schedules',
    helpText: "Every S days, between days B and E, at time T"
  },

  visualization: {
    colour: 208,
  },

  connections: {
    mode: "value",
    output: "schedule"
  },

  lines: [
    [ "Daily", "LEFT" ],

    [ "...at:", {
      inputValue: 'TIME',
      check: 'cron_minute_hour',
      shadow: 'selector_time'
    }],

    [ "...every:", {
      inputValue: 'DAYS',
      check: 'cron_days_range',
      shadow: 'selector_days'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        time = generator.valueToCode(block, 'TIME', 0),
        days = generator.valueToCode(block, 'DAYS', 0),
        crontab = `${time} ${days} * *`

      return [ crontab , 0 ]
    }
  }
}
