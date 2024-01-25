export default {
  type: 'schedule_monthly',

  toolbox: {
    category: 'Schedules',
    label: "Fires on given months, on a given date, at a given time."
  },

  visualization: {
    colour: 208,
    tooltip: [
      "Fires at TIME, on DAY, of MONTHS.",
      "---------------",
      "Parameters:",
      "TIME - the time-of-day to fire",
      "DAY - the day of the month to fire",
      "MONTHS - the months to fire during"
    ].join('\n')
  },

  connections: {
    mode: 'value',
    output: 'schedule'
  },

  lines: [
    [ "Monthly", "LEFT" ],

    [ "...at:", {
      inputValue: 'TIME',
      check: 'cron_minute_hour',
      shadow: 'selector_time'
    }],

    [ "...on:", {
      inputValue: 'DAY_OF_MONTH',
      check: 'cron_day_of_month',
      shadow: 'selector_day_of_month'
    }],

    [ '...of:', {
      inputValue: 'MONTHS',
      check: 'cron_month',
      shadow: 'selector_months'
    }],
  ],

  generators: {
    json: (block, generator) => {
      const
        time = generator.valueToCode(block, 'TIME', 0),
        day = generator.valueToCode(block, 'DAY_OF_MONTH', 0),
        months = generator.valueToCode(block, 'MONTHS', 0)

    // TODO: validations
    // must select a day
    // if(!days.length) { }

    return [ `${time} ${day} ${months} *` , 0 ]
    }
  }
}
