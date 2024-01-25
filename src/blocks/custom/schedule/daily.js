export default {
  type: "schedule_daily",

  toolbox: {
    category: 'Schedules',
    label: "Fires at a given time, on given days of the month."
  },

  visualization: {
    colour: 208,
    tooltip: [
      "Fires at TIME, every STEP days, from START day to END day.",
      "---------------",
      "Parameters:",
      "TIME - the time-of-day to fire",
      "STEP - fires every STEP days. Default: 1, 'Every day'",
      "START -  the first day to run. Default: 1, 'First of the Month'",
      "END - the last day to run. Default: 31, 'Last of the month'",
    ].join('\n')
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
