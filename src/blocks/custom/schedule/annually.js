export default {
  type: 'schedule_annually',

  toolbox: {
    category: 'Schedules',
    label: 'Fires once a year, at a given date and time'
  },

  visualization: {
    colour: 208,
    tooltip: [
      "Fires in given MONTH, on DAY, at TIME.",
      "---------------",
      "Parameters:",
      "MONTH - month of the year to fire",
      "DAY - the date of the month to fire",
      "TIME - the time-of-day to fire",
    ].join('\n')
  },

  connections: {
    mode: 'value',
    output: 'schedule'
  },

  lines: [
    [ "Annually", "LEFT" ],

    [ "...in:", {
      inputValue: 'MONTH',
      check: 'cron_month',
      shadow: 'selector_month'
    }],

    [ "...on:", {
      inputValue: 'DAY_OF_MONTH',
      check: 'cron_day_of_month',
      shadow: 'selector_day_of_month'
    }],

    [ "...at:", {
      inputValue: 'TIME',
      check: 'cron_minute_hour',
      shadow: 'selector_time'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        time = generator.valueToCode(block, 'TIME', 0),
        day = generator.valueToCode(block, 'DAY_OF_MONTH', 0),
        month = generator.valueToCode(block, 'MONTH', 0)

    // TODO: validations
    // must select a day
    // if(!days.length) { }

    return [ `${time} ${day} ${month} *` , 0 ]
    }
  }
}
