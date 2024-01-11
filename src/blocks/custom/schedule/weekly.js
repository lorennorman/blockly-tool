import timeLines, { cronTime } from '../lines/time.js'


export default {
  type: 'schedule_weekly',

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
