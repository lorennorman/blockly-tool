export default {
  type: "hour_settings",

  visualization: {
    colour: 30,
    tooltip: "How would you like to specify hours of the day for your schedule?"
  },

  connections: {},

  lines: [
    [ "Hour:", {
      inputValue: 'HOUR_BLOCK',
      check: 'cron_hour',
      shadow: 'all_hours'
    }],
  ],

  generators: {
    json: block => { }
  }
}
