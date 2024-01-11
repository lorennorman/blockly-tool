export default {
  type: "schedule_daily",

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
    [ "Daily", "LEFT" ],

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
        crontab = `${time} * * *`

      return [ crontab , 0 ]
    }
  }
}
