export default {
  type: "schedule_settings",

  visualization: {
    colour: 30,
    tooltip: "How would you like to specify the months portion of your schedule?"
  },

  connections: {},

  lines: [
    [ "Month:", {
      inputValue: 'MONTH_BLOCK',
      check: 'cron_month',
      shadow: 'all_months'
    }],

    [ "Day:", {
      inputValue: 'DAY_BLOCK',
      check: 'cron_day',
      // shadow: 'all_days'
    }],

    [ "Hour:", {
      inputValue: 'HOUR_BLOCK',
      check: 'cron_hour',
      // shadow: 'all_hours'
    }],

    [ "Minute:", {
      inputValue: 'MINUTE_BLOCK',
      check: 'cron_minute',
      // shadow: 'all_minutes'
    }],
  ],

  generators: {
    json: block => { }
  }
}
