export default {
  type: "all_days",

  visualization: {
    colour: 40,
    tooltip: "Runs during every day of the month."
  },

  connections: {
    mode: 'value',
    output: 'cron_day'
  },

  lines: [ "Every day" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
