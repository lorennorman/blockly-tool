export default {
  type: "minute_settings",

  visualization: {
    colour: 30,
    tooltip: "How would you like to specify minutes of the hour for your schedule?"
  },

  connections: {},

  lines: [
    [ "Minute:", {
      inputValue: 'MINUTE_BLOCK',
      check: 'cron_minute',
      shadow: 'all_minutes'
    }],
  ],

  generators: {
    json: block => { }
  }
}
