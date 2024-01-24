export default {
  type: 'schedule_monthly',

  toolbox: {
    category: 'Schedules',
    helpText: "On specified months M, on specified day D, at time T"
  },

  visualization: {
    colour: 208,
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
