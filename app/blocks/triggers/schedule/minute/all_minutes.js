export default {
  type: "all_minutes",

  visualization: {
    colour: 30,
    tooltip: "Runs every minute of the hour."
  },

  connections: {
    mode: 'value',
    output: 'cron_minute'
  },

  lines: [ "Every minute" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
