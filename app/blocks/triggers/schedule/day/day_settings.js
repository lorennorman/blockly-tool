export default {
  type: "day_settings",

  visualization: {
    colour: 30,
    tooltip: "How would you like to specify days of the month for your schedule?"
  },

  connections: {},

  lines: [
    [ "Day:", {
      inputValue: 'DAY_BLOCK',
      check: 'cron_day',
      shadow: 'all_days'
    }],
  ],

  generators: {
    json: block => { }
  }
}
