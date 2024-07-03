export default {
  type: 'schedule_weekly',

  toolbox: {
    category: 'Schedules',
    label: "Fires at a given time, on given days of the week."
  },

  visualization: {
    colour: 160,
    tooltip: [
      "Fires at TIME, on DAYS of the week.",
      "---------------",
      "Parameters:",
      "TIME - the time-of-day to fire",
      "DAYS - the days of the week to fire",
    ].join('\n')
  },

  connections: {
    mode: 'value',
    output: 'schedule'
  },

  lines: [
    ['Weekly', 'LEFT'],

    [ "...at:", {
      inputValue: 'TIME',
      check: 'cron_minute_hour',
      shadow: 'selector_time'
    }],

    [ "...on:", {
      inputValue: 'DAYS_OF_WEEK',
      check: 'cron_day_of_week',
      shadow: 'selector_day_of_week'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        time = generator.valueToCode(block, 'TIME', 0),
        days = generator.valueToCode(block, 'DAYS_OF_WEEK', 0)

      // TODO: validations
      // must select a day
      // if(!days.length) { }

      return [ `${time} * * ${days}` , 0 ]
    }
  }
}
