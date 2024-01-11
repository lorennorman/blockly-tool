export default {
  type: 'schedule_annually',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 208,
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
